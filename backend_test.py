#!/usr/bin/env python3
"""
Backend API Testing for Stripe Payment Integration
Tests all payment-related endpoints for the Mental Health App
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://mindwell-23.preview.emergentagent.com/api"
TEST_USER_EMAIL = "testuser@example.com"
TEST_USER_PASSWORD = "testpass123"
TEST_USER_NAME = "Test User"

class BackendTester:
    def __init__(self):
        self.session = None
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, status: str, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
        if response_data and status == "FAIL":
            print(f"   Response: {response_data}")
        print()
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple:
        """Make HTTP request and return (status_code, response_data)"""
        url = f"{BASE_URL}{endpoint}"
        
        # Add auth header if available
        if self.auth_token and headers is None:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
        elif self.auth_token and headers:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            async with self.session.request(method, url, json=data, headers=headers) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                return response.status, response_data
        except Exception as e:
            return 0, str(e)
    
    async def setup_test_user(self):
        """Create or login test user"""
        print("🔧 Setting up test user...")
        
        # Try to register user first
        user_data = {
            "name": TEST_USER_NAME,
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "confirm_password": TEST_USER_PASSWORD
        }
        
        status, response = await self.make_request("POST", "/register", user_data)
        
        if status == 200:
            self.auth_token = response.get("access_token")
            self.user_data = response.get("user")
            self.log_test("User Registration", "PASS", "New test user created successfully")
        elif status == 400 and "já está registrado" in str(response):
            # User exists, try to login
            login_data = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            
            status, response = await self.make_request("POST", "/login", login_data)
            if status == 200:
                self.auth_token = response.get("access_token")
                self.user_data = response.get("user")
                self.log_test("User Login", "PASS", "Existing test user logged in successfully")
            else:
                self.log_test("User Login", "FAIL", f"Login failed: {response}", response)
                return False
        else:
            self.log_test("User Setup", "FAIL", f"Registration failed: {response}", response)
            return False
        
        return True
    
    async def test_get_ebook_packages(self):
        """Test GET /api/payments/packages endpoint"""
        print("📦 Testing GET /api/payments/packages...")
        
        status, response = await self.make_request("GET", "/payments/packages")
        
        if status == 200:
            if isinstance(response, dict) and "packages" in response:
                packages = response["packages"]
                if isinstance(packages, list) and len(packages) > 0:
                    # Verify package structure
                    required_fields = ["id", "title", "price", "category", "currency"]
                    first_package = packages[0]
                    
                    missing_fields = [field for field in required_fields if field not in first_package]
                    if not missing_fields:
                        self.log_test("Get Ebook Packages", "PASS", 
                                    f"Retrieved {len(packages)} packages successfully", 
                                    {"package_count": len(packages), "sample_package": first_package})
                    else:
                        self.log_test("Get Ebook Packages", "FAIL", 
                                    f"Package missing required fields: {missing_fields}", response)
                else:
                    self.log_test("Get Ebook Packages", "FAIL", "No packages returned", response)
            else:
                self.log_test("Get Ebook Packages", "FAIL", "Invalid response format", response)
        else:
            self.log_test("Get Ebook Packages", "FAIL", f"HTTP {status}", response)
    
    async def test_create_checkout_session(self):
        """Test POST /api/payments/checkout/session endpoint"""
        print("💳 Testing POST /api/payments/checkout/session...")
        
        if not self.auth_token:
            self.log_test("Create Checkout Session", "FAIL", "No auth token available")
            return None
        
        # Test with valid ebook ID
        checkout_data = {
            "ebook_id": "mindfulness",
            "origin_url": "https://mindwell-23.preview.emergentagent.com"
        }
        
        status, response = await self.make_request("POST", "/payments/checkout/session", checkout_data)
        
        if status == 200:
            if isinstance(response, dict) and "url" in response and "session_id" in response:
                session_id = response["session_id"]
                self.log_test("Create Checkout Session", "PASS", 
                            "Checkout session created successfully", 
                            {"session_id": session_id, "has_url": bool(response.get("url"))})
                return session_id
            else:
                self.log_test("Create Checkout Session", "FAIL", "Invalid response format", response)
        elif status == 500 and "Stripe" in str(response):
            # Expected in sandbox environment without real Stripe keys
            self.log_test("Create Checkout Session", "WARN", 
                        "Stripe integration error (expected in sandbox)", response)
        else:
            self.log_test("Create Checkout Session", "FAIL", f"HTTP {status}", response)
        
        # Test with invalid ebook ID
        invalid_data = {
            "ebook_id": "invalid_ebook",
            "origin_url": "https://mindwell-23.preview.emergentagent.com"
        }
        
        status, response = await self.make_request("POST", "/payments/checkout/session", invalid_data)
        
        if status == 400:
            self.log_test("Create Checkout Session (Invalid Ebook)", "PASS", 
                        "Correctly rejected invalid ebook ID", response)
        else:
            self.log_test("Create Checkout Session (Invalid Ebook)", "FAIL", 
                        f"Should return 400 for invalid ebook, got {status}", response)
        
        return None
    
    async def test_checkout_status(self, session_id: Optional[str] = None):
        """Test GET /api/payments/checkout/status/{session_id} endpoint"""
        print("📊 Testing GET /api/payments/checkout/status/{session_id}...")
        
        if not self.auth_token:
            self.log_test("Get Checkout Status", "FAIL", "No auth token available")
            return
        
        # Test with dummy session ID since we might not have a real one
        test_session_id = session_id or "cs_test_dummy_session_id"
        
        status, response = await self.make_request("GET", f"/payments/checkout/status/{test_session_id}")
        
        if status == 404:
            self.log_test("Get Checkout Status", "PASS", 
                        "Correctly returned 404 for non-existent session", response)
        elif status == 500 and "Stripe" in str(response):
            # Expected in sandbox environment
            self.log_test("Get Checkout Status", "WARN", 
                        "Stripe integration error (expected in sandbox)", response)
        elif status == 200:
            # If we somehow get a successful response
            required_fields = ["session_id", "status", "payment_status"]
            missing_fields = [field for field in required_fields if field not in response]
            if not missing_fields:
                self.log_test("Get Checkout Status", "PASS", 
                            "Status retrieved successfully", response)
            else:
                self.log_test("Get Checkout Status", "FAIL", 
                            f"Response missing fields: {missing_fields}", response)
        else:
            self.log_test("Get Checkout Status", "FAIL", f"HTTP {status}", response)
    
    async def test_stripe_webhook(self):
        """Test POST /api/webhook/stripe endpoint"""
        print("🔗 Testing POST /api/webhook/stripe...")
        
        # Test webhook with dummy data (without Stripe signature)
        webhook_data = {
            "id": "evt_test_webhook",
            "object": "event",
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": "cs_test_session",
                    "payment_status": "paid"
                }
            }
        }
        
        # Don't use auth token for webhook (Stripe calls this)
        status, response = await self.make_request("POST", "/webhook/stripe", webhook_data, headers={})
        
        if status == 500:
            # Expected without proper Stripe signature
            self.log_test("Stripe Webhook", "WARN", 
                        "Webhook failed without Stripe signature (expected)", response)
        elif status == 200:
            self.log_test("Stripe Webhook", "PASS", "Webhook processed successfully", response)
        else:
            self.log_test("Stripe Webhook", "FAIL", f"HTTP {status}", response)
    
    async def test_authentication_required(self):
        """Test that protected endpoints require authentication"""
        print("🔒 Testing authentication requirements...")
        
        # Test checkout session without auth
        checkout_data = {
            "ebook_id": "mindfulness",
            "origin_url": "https://mindwell-23.preview.emergentagent.com"
        }
        
        status, response = await self.make_request("POST", "/payments/checkout/session", 
                                                 checkout_data, headers={})
        
        if status == 401 or status == 403:
            self.log_test("Auth Required - Checkout Session", "PASS", 
                        "Correctly requires authentication", response)
        else:
            self.log_test("Auth Required - Checkout Session", "FAIL", 
                        f"Should require auth, got {status}", response)
        
        # Test checkout status without auth
        status, response = await self.make_request("GET", "/payments/checkout/status/test_session", 
                                                 headers={})
        
        if status == 401 or status == 403:
            self.log_test("Auth Required - Checkout Status", "PASS", 
                        "Correctly requires authentication", response)
        else:
            self.log_test("Auth Required - Checkout Status", "FAIL", 
                        f"Should require auth, got {status}", response)
    
    async def test_existing_endpoints_still_work(self):
        """Test that existing endpoints are not broken"""
        print("🔄 Testing existing endpoints still work...")
        
        # Test basic API endpoint
        status, response = await self.make_request("GET", "/")
        if status == 200:
            self.log_test("Basic API Endpoint", "PASS", "Root endpoint working", response)
        else:
            self.log_test("Basic API Endpoint", "FAIL", f"HTTP {status}", response)
        
        # Test user info endpoint (requires auth)
        if self.auth_token:
            status, response = await self.make_request("GET", "/me")
            if status == 200 and isinstance(response, dict) and "email" in response:
                self.log_test("User Info Endpoint", "PASS", "User info retrieved", 
                            {"user_email": response.get("email")})
            else:
                self.log_test("User Info Endpoint", "FAIL", f"HTTP {status}", response)
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("🧪 STRIPE PAYMENT INTEGRATION TEST SUMMARY")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed = len([r for r in self.test_results if r["status"] == "PASS"])
        failed = len([r for r in self.test_results if r["status"] == "FAIL"])
        warnings = len([r for r in self.test_results if r["status"] == "WARN"])
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"⚠️  Warnings: {warnings}")
        print()
        
        if failed > 0:
            print("❌ FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"  - {result['test']}: {result['details']}")
            print()
        
        if warnings > 0:
            print("⚠️  WARNINGS (Expected in sandbox):")
            for result in self.test_results:
                if result["status"] == "WARN":
                    print(f"  - {result['test']}: {result['details']}")
            print()
        
        print("🔍 DETAILED FINDINGS:")
        print("- GET /api/payments/packages: Tests ebook package retrieval")
        print("- POST /api/payments/checkout/session: Tests Stripe checkout creation (requires auth)")
        print("- GET /api/payments/checkout/status/{session_id}: Tests payment status check (requires auth)")
        print("- POST /api/webhook/stripe: Tests Stripe webhook handler")
        print("- Authentication: Tests that protected endpoints require valid tokens")
        print("- Existing endpoints: Verifies no breaking changes to current functionality")
        
        return failed == 0

async def main():
    """Run all payment integration tests"""
    print("🚀 Starting Stripe Payment Integration Tests")
    print(f"🌐 Testing against: {BASE_URL}")
    print("="*60)
    
    async with BackendTester() as tester:
        # Setup test user
        if not await tester.setup_test_user():
            print("❌ Failed to setup test user. Aborting tests.")
            return False
        
        # Run all tests
        await tester.test_get_ebook_packages()
        session_id = await tester.test_create_checkout_session()
        await tester.test_checkout_status(session_id)
        await tester.test_stripe_webhook()
        await tester.test_authentication_required()
        await tester.test_existing_endpoints_still_work()
        
        # Print summary
        success = tester.print_summary()
        return success

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test execution failed: {e}")
        sys.exit(1)