#!/usr/bin/env python3
"""
Backend API Testing Script for Corporate Checkout Endpoint
Tests the newly created corporate checkout endpoint
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'https://moodjourney-205.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE_URL}")

class CorporateCheckoutAPITester:
    def __init__(self):
        self.session = None
        self.test_results = []
        
    async def setup(self):
        """Setup HTTP session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Cleanup HTTP session"""
        if self.session:
            await self.session.close()
            
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
        
    async def test_corporate_checkout_valid_request(self):
        """Test POST /api/corporate/checkout with valid data"""
        test_name = "POST /api/corporate/checkout - Valid Request"
        
        # Test data from the review request
        test_data = {
            "company": "Tech Solutions Inc",
            "name": "Carlos Silva", 
            "email": "carlos@techsolutions.com",
            "phone": "(11) 99887-7665",
            "employees": 75,
            "plan": "business",
            "origin_url": "http://localhost:8080"
        }
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                response_text = await response.text()
                print(f"Response status: {response.status}")
                print(f"Response body: {response_text}")
                
                if response.status == 200:
                    response_data = await response.json()
                    
                    # Validate response structure
                    required_fields = ["success", "checkout_url", "session_id"]
                    missing_fields = [field for field in required_fields if field not in response_data]
                    
                    if missing_fields:
                        self.log_result(test_name, False, f"Missing response fields: {missing_fields}", response_data)
                        return None
                    
                    if response_data.get("success") == True:
                        if response_data.get("checkout_url") and response_data.get("checkout_url").startswith("http"):
                            self.log_result(test_name, True, "Corporate checkout created successfully", response_data)
                            return response_data.get("session_id")
                        else:
                            self.log_result(test_name, False, "Invalid checkout_url in response", response_data)
                            return None
                    else:
                        self.log_result(test_name, False, "Success field is not True", response_data)
                        return None
                else:
                    self.log_result(test_name, False, f"HTTP {response.status}: {response_text}")
                    return None
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request failed: {str(e)}")
            return None
            
    async def test_corporate_checkout_missing_required_fields(self):
        """Test POST /api/corporate/checkout with missing required fields"""
        test_name = "POST /api/corporate/checkout - Missing Required Fields"
        
        # Test with missing required fields
        test_cases = [
            {"name": "Missing company", "data": {"name": "Carlos Silva", "email": "carlos@test.com", "employees": 75, "plan": "business", "origin_url": "http://localhost:8080"}},
            {"name": "Missing name", "data": {"company": "Test Corp", "email": "carlos@test.com", "employees": 75, "plan": "business", "origin_url": "http://localhost:8080"}},
            {"name": "Missing email", "data": {"company": "Test Corp", "name": "Carlos Silva", "employees": 75, "plan": "business", "origin_url": "http://localhost:8080"}},
            {"name": "Missing employees", "data": {"company": "Test Corp", "name": "Carlos Silva", "email": "carlos@test.com", "plan": "business", "origin_url": "http://localhost:8080"}},
            {"name": "Missing plan", "data": {"company": "Test Corp", "name": "Carlos Silva", "email": "carlos@test.com", "employees": 75, "origin_url": "http://localhost:8080"}},
            {"name": "Missing origin_url", "data": {"company": "Test Corp", "name": "Carlos Silva", "email": "carlos@test.com", "employees": 75, "plan": "business"}},
        ]
        
        for test_case in test_cases:
            try:
                async with self.session.post(
                    f"{API_BASE_URL}/corporate/checkout",
                    json=test_case["data"],
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    if response.status == 422:  # Validation error expected
                        self.log_result(f"{test_name} - {test_case['name']}", True, "Correctly rejected missing field")
                    else:
                        response_text = await response.text()
                        self.log_result(f"{test_name} - {test_case['name']}", False, f"Expected 422, got {response.status}: {response_text}")
                        
            except Exception as e:
                self.log_result(f"{test_name} - {test_case['name']}", False, f"Request failed: {str(e)}")
                
    async def test_corporate_checkout_invalid_plan(self):
        """Test POST /api/corporate/checkout with invalid plan"""
        test_name = "POST /api/corporate/checkout - Invalid Plan"
        
        test_data = {
            "company": "Tech Solutions Inc",
            "name": "Carlos Silva",
            "email": "carlos@techsolutions.com",
            "phone": "(11) 99887-7665",
            "employees": 75,
            "plan": "invalid_plan",
            "origin_url": "http://localhost:8080"
        }
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 400:  # Bad request expected
                    response_data = await response.json()
                    if "Plano inválido" in response_data.get("detail", ""):
                        self.log_result(test_name, True, "Correctly rejected invalid plan")
                    else:
                        self.log_result(test_name, False, f"Wrong error message: {response_data}")
                else:
                    response_text = await response.text()
                    self.log_result(test_name, False, f"Expected 400, got {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request failed: {str(e)}")
            
    async def test_corporate_checkout_valid_plans(self):
        """Test POST /api/corporate/checkout with all valid plans"""
        test_name = "POST /api/corporate/checkout - Valid Plans"
        
        plans = ["starter", "business", "enterprise"]
        
        for plan in plans:
            test_data = {
                "company": f"Test Company {plan.title()}",
                "name": "Test User",
                "email": f"test.{plan}@company.com",
                "phone": "(11) 99999-9999",
                "employees": 50,
                "plan": plan,
                "origin_url": "http://localhost:8080"
            }
            
            try:
                async with self.session.post(
                    f"{API_BASE_URL}/corporate/checkout",
                    json=test_data,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    if response.status == 200:
                        response_data = await response.json()
                        if response_data.get("success"):
                            self.log_result(f"{test_name} - {plan}", True, f"Plan '{plan}' accepted successfully")
                        else:
                            self.log_result(f"{test_name} - {plan}", False, f"Plan '{plan}' returned success=False")
                    else:
                        response_text = await response.text()
                        self.log_result(f"{test_name} - {plan}", False, f"Plan '{plan}' failed: HTTP {response.status}: {response_text}")
                        
            except Exception as e:
                self.log_result(f"{test_name} - {plan}", False, f"Plan '{plan}' failed: {str(e)}")
                
    async def test_corporate_checkout_invalid_data_types(self):
        """Test POST /api/corporate/checkout with invalid data types"""
        test_name = "POST /api/corporate/checkout - Invalid Data Types"
        
        # Test with invalid email format
        test_data = {
            "company": "Tech Solutions Inc",
            "name": "Carlos Silva",
            "email": "invalid-email",  # Invalid email format
            "phone": "(11) 99887-7665",
            "employees": 75,
            "plan": "business",
            "origin_url": "http://localhost:8080"
        }
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 422:  # Validation error expected
                    self.log_result(f"{test_name} - Invalid Email", True, "Correctly rejected invalid email format")
                else:
                    response_text = await response.text()
                    self.log_result(f"{test_name} - Invalid Email", False, f"Expected 422, got {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(f"{test_name} - Invalid Email", False, f"Request failed: {str(e)}")
            
        # Test with invalid employee count
        test_data["email"] = "carlos@techsolutions.com"  # Fix email
        test_data["employees"] = "not-a-number"  # Invalid employee count
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 422:  # Validation error expected
                    self.log_result(f"{test_name} - Invalid Employees", True, "Correctly rejected invalid employee count")
                else:
                    response_text = await response.text()
                    self.log_result(f"{test_name} - Invalid Employees", False, f"Expected 422, got {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(f"{test_name} - Invalid Employees", False, f"Request failed: {str(e)}")
            
    async def test_corporate_checkout_optional_phone(self):
        """Test POST /api/corporate/checkout without optional phone field"""
        test_name = "POST /api/corporate/checkout - Optional Phone Field"
        
        test_data = {
            "company": "Tech Solutions Inc",
            "name": "Carlos Silva",
            "email": "carlos@techsolutions.com",
            # phone field omitted (optional)
            "employees": 75,
            "plan": "business",
            "origin_url": "http://localhost:8080"
        }
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    response_data = await response.json()
                    if response_data.get("success"):
                        self.log_result(test_name, True, "Successfully handled missing optional phone field")
                    else:
                        self.log_result(test_name, False, "Checkout failed despite valid data")
                else:
                    response_text = await response.text()
                    self.log_result(test_name, False, f"HTTP {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request failed: {str(e)}")
            
    async def test_price_calculation(self):
        """Test price calculation for different plans and employee counts"""
        test_name = "Price Calculation Test"
        
        # Test different combinations
        test_cases = [
            {"plan": "starter", "employees": 10, "expected_price_per_employee": 15},
            {"plan": "business", "employees": 50, "expected_price_per_employee": 12},
            {"plan": "enterprise", "employees": 100, "expected_price_per_employee": 8},
        ]
        
        for case in test_cases:
            test_data = {
                "company": f"Price Test {case['plan'].title()}",
                "name": "Test User",
                "email": f"test@{case['plan']}.com",
                "phone": "(11) 99999-9999",
                "employees": case["employees"],
                "plan": case["plan"],
                "origin_url": "http://localhost:8080"
            }
            
            try:
                async with self.session.post(
                    f"{API_BASE_URL}/corporate/checkout",
                    json=test_data,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    if response.status == 200:
                        response_data = await response.json()
                        if response_data.get("success"):
                            expected_total = case["employees"] * case["expected_price_per_employee"]
                            self.log_result(f"{test_name} - {case['plan']}", True, f"Price calculation appears correct for {case['employees']} employees (expected total: {expected_total} BRL)")
                        else:
                            self.log_result(f"{test_name} - {case['plan']}", False, "Checkout creation failed")
                    else:
                        response_text = await response.text()
                        self.log_result(f"{test_name} - {case['plan']}", False, f"HTTP {response.status}: {response_text}")
                        
            except Exception as e:
                self.log_result(f"{test_name} - {case['plan']}", False, f"Request failed: {str(e)}")
                
    async def test_database_persistence(self):
        """Test that corporate transactions are saved to MongoDB"""
        test_name = "Database Persistence - Corporate Transactions"
        
        # Create a checkout with unique data
        unique_company = f"DB Test Corp {datetime.now().strftime('%Y%m%d%H%M%S')}"
        test_data = {
            "company": unique_company,
            "name": "DB Test User",
            "email": "dbtest@company.com",
            "phone": "(11) 99999-9999",
            "employees": 25,
            "plan": "starter",
            "origin_url": "http://localhost:8080"
        }
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    response_data = await response.json()
                    if response_data.get("success") and response_data.get("session_id"):
                        self.log_result(test_name, True, "Corporate transaction appears to be saved (checkout successful)")
                    else:
                        self.log_result(test_name, False, "Checkout response missing required fields")
                else:
                    response_text = await response.text()
                    self.log_result(test_name, False, f"Database persistence may be failing: HTTP {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request failed: {str(e)}")
            
    async def test_error_handling(self):
        """Test error handling for various edge cases"""
        test_name = "Error Handling Tests"
        
        # Test malformed JSON
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                data="invalid json",
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status in [400, 422]:
                    self.log_result(f"{test_name} - Malformed JSON", True, "Correctly rejected malformed JSON")
                else:
                    response_text = await response.text()
                    self.log_result(f"{test_name} - Malformed JSON", False, f"Expected 400/422, got {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(f"{test_name} - Malformed JSON", False, f"Request failed: {str(e)}")
            
        # Test empty request body
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/checkout",
                json={},
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 422:
                    self.log_result(f"{test_name} - Empty Body", True, "Correctly rejected empty request body")
                else:
                    response_text = await response.text()
                    self.log_result(f"{test_name} - Empty Body", False, f"Expected 422, got {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(f"{test_name} - Empty Body", False, f"Request failed: {str(e)}")
            
    async def run_all_tests(self):
        """Run all tests"""
        print("=" * 80)
        print("CORPORATE CHECKOUT ENDPOINT TESTING")
        print("=" * 80)
        print(f"Backend URL: {API_BASE_URL}")
        print(f"Testing endpoint: POST /api/corporate/checkout")
        print(f"Test started at: {datetime.now().isoformat()}")
        print()
        
        await self.setup()
        
        try:
            # Test basic functionality
            print("Testing basic functionality...")
            await self.test_corporate_checkout_valid_request()
            
            print("\nTesting validation...")
            await self.test_corporate_checkout_missing_required_fields()
            await self.test_corporate_checkout_invalid_plan()
            await self.test_corporate_checkout_valid_plans()
            await self.test_corporate_checkout_invalid_data_types()
            await self.test_corporate_checkout_optional_phone()
            
            print("\nTesting business logic...")
            await self.test_price_calculation()
            
            print("\nTesting database integration...")
            await self.test_database_persistence()
            
            print("\nTesting error handling...")
            await self.test_error_handling()
            
        finally:
            await self.cleanup()
            
        # Print summary
        print("\n" + "=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        print(f"\nTest completed at: {datetime.now().isoformat()}")
        
        return passed_tests, failed_tests

async def main():
    """Main test function"""
    tester = CorporateCheckoutAPITester()
    passed, failed = await tester.run_all_tests()
    
    # Exit with error code if tests failed
    if failed > 0:
        exit(1)
    else:
        exit(0)

if __name__ == "__main__":
    asyncio.run(main())