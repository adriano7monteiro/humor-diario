#!/usr/bin/env python3
"""
Backend API Testing Script for Corporate Quote Endpoints
Tests the newly created corporate quote endpoints
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
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'https://mindwell-23.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE_URL}")

class CorporateQuoteAPITester:
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
        
    async def test_post_corporate_quote_valid_data(self):
        """Test POST /api/corporate/quote with valid data"""
        test_name = "POST /api/corporate/quote - Valid Data"
        
        # Test data as specified in the review request
        test_data = {
            "company": "Tech Corp Ltda",
            "name": "João Silva", 
            "email": "joao@techcorp.com",
            "phone": "(11) 99999-9999",
            "employees": 150,
            "message": "Interessados em implementar saúde mental",
            "selectedPlan": "BUSINESS",
            "source": "corporate_website"
        }
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/quote",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                response_text = await response.text()
                print(f"Response status: {response.status}")
                print(f"Response body: {response_text}")
                
                if response.status == 200:
                    response_data = await response.json()
                    
                    # Validate response structure
                    required_fields = ["success", "message", "quote_id"]
                    missing_fields = [field for field in required_fields if field not in response_data]
                    
                    if missing_fields:
                        self.log_result(test_name, False, f"Missing response fields: {missing_fields}", response_data)
                        return None
                    
                    if response_data.get("success") == True:
                        self.log_result(test_name, True, "Corporate quote created successfully", response_data)
                        return response_data.get("quote_id")
                    else:
                        self.log_result(test_name, False, "Success field is not True", response_data)
                        return None
                else:
                    self.log_result(test_name, False, f"HTTP {response.status}: {response_text}")
                    return None
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request failed: {str(e)}")
            return None
            
    async def test_post_corporate_quote_missing_required_fields(self):
        """Test POST /api/corporate/quote with missing required fields"""
        test_name = "POST /api/corporate/quote - Missing Required Fields"
        
        # Test with missing required fields
        test_cases = [
            {"name": "Missing company", "data": {"name": "João Silva", "email": "joao@test.com", "employees": 150}},
            {"name": "Missing name", "data": {"company": "Test Corp", "email": "joao@test.com", "employees": 150}},
            {"name": "Missing email", "data": {"company": "Test Corp", "name": "João Silva", "employees": 150}},
            {"name": "Missing employees", "data": {"company": "Test Corp", "name": "João Silva", "email": "joao@test.com"}},
        ]
        
        for test_case in test_cases:
            try:
                async with self.session.post(
                    f"{API_BASE_URL}/corporate/quote",
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
                
    async def test_post_corporate_quote_invalid_data_types(self):
        """Test POST /api/corporate/quote with invalid data types"""
        test_name = "POST /api/corporate/quote - Invalid Data Types"
        
        # Test with invalid data types
        test_data = {
            "company": "Test Corp",
            "name": "João Silva", 
            "email": "invalid-email",  # Invalid email format
            "phone": "(11) 99999-9999",
            "employees": "not-a-number",  # Should be integer
            "message": "Test message",
            "selectedPlan": "BUSINESS",
            "source": "corporate_website"
        }
        
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/quote",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 422:  # Validation error expected
                    self.log_result(test_name, True, "Correctly rejected invalid data types")
                else:
                    response_text = await response.text()
                    self.log_result(test_name, False, f"Expected 422, got {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request failed: {str(e)}")
            
    async def test_get_corporate_quotes_no_auth(self):
        """Test GET /api/corporate/quotes without authentication"""
        test_name = "GET /api/corporate/quotes - No Authentication"
        
        try:
            async with self.session.get(f"{API_BASE_URL}/corporate/quotes") as response:
                response_text = await response.text()
                print(f"Response status: {response.status}")
                print(f"Response body: {response_text}")
                
                if response.status == 200:
                    response_data = await response.json()
                    
                    # Validate response structure
                    if "quotes" in response_data and "total" in response_data:
                        self.log_result(test_name, True, f"Retrieved {len(response_data['quotes'])} quotes, total: {response_data['total']}", response_data)
                    else:
                        self.log_result(test_name, False, "Missing 'quotes' or 'total' in response", response_data)
                else:
                    self.log_result(test_name, False, f"HTTP {response.status}: {response_text}")
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request failed: {str(e)}")
            
    async def test_get_corporate_quotes_with_filters(self):
        """Test GET /api/corporate/quotes with query parameters"""
        test_name = "GET /api/corporate/quotes - With Filters"
        
        # Test with different query parameters
        test_cases = [
            {"name": "Status filter", "params": {"status": "pending"}},
            {"name": "Pagination", "params": {"skip": 0, "limit": 10}},
            {"name": "Combined filters", "params": {"status": "pending", "skip": 0, "limit": 5}},
        ]
        
        for test_case in test_cases:
            try:
                async with self.session.get(
                    f"{API_BASE_URL}/corporate/quotes",
                    params=test_case["params"]
                ) as response:
                    
                    if response.status == 200:
                        response_data = await response.json()
                        self.log_result(f"{test_name} - {test_case['name']}", True, f"Retrieved {len(response_data['quotes'])} quotes with filters", test_case["params"])
                    else:
                        response_text = await response.text()
                        self.log_result(f"{test_name} - {test_case['name']}", False, f"HTTP {response.status}: {response_text}")
                        
            except Exception as e:
                self.log_result(f"{test_name} - {test_case['name']}", False, f"Request failed: {str(e)}")
                
    async def test_database_persistence(self):
        """Test that data is properly stored and retrieved from database"""
        test_name = "Database Persistence Test"
        
        # First create a quote with unique data
        unique_company = f"Test Corp {datetime.now().strftime('%Y%m%d%H%M%S')}"
        test_data = {
            "company": unique_company,
            "name": "Test User", 
            "email": "test@testcorp.com",
            "phone": "(11) 88888-8888",
            "employees": 75,
            "message": "Test persistence message",
            "selectedPlan": "PREMIUM",
            "source": "api_test"
        }
        
        try:
            # Create quote
            async with self.session.post(
                f"{API_BASE_URL}/corporate/quote",
                json=test_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status != 200:
                    response_text = await response.text()
                    self.log_result(test_name, False, f"Failed to create test quote: {response.status} - {response_text}")
                    return
                
                create_response = await response.json()
                quote_id = create_response.get("quote_id")
                
            # Retrieve quotes and verify our quote exists
            async with self.session.get(f"{API_BASE_URL}/corporate/quotes") as response:
                if response.status != 200:
                    response_text = await response.text()
                    self.log_result(test_name, False, f"Failed to retrieve quotes: {response.status} - {response_text}")
                    return
                
                response_data = await response.json()
                quotes = response_data.get("quotes", [])
                
                # Find our quote
                found_quote = None
                for quote in quotes:
                    if quote.get("company") == unique_company:
                        found_quote = quote
                        break
                
                if found_quote:
                    # Verify all fields are correctly stored
                    field_checks = [
                        ("company", unique_company),
                        ("name", "Test User"),
                        ("email", "test@testcorp.com"),
                        ("phone", "(11) 88888-8888"),
                        ("employees", 75),
                        ("message", "Test persistence message"),
                        ("selected_plan", "PREMIUM"),
                        ("source", "api_test"),
                        ("status", "pending")
                    ]
                    
                    mismatches = []
                    for field, expected_value in field_checks:
                        actual_value = found_quote.get(field)
                        if actual_value != expected_value:
                            mismatches.append(f"{field}: expected '{expected_value}', got '{actual_value}'")
                    
                    if mismatches:
                        self.log_result(test_name, False, f"Field mismatches: {', '.join(mismatches)}", found_quote)
                    else:
                        self.log_result(test_name, True, "Quote correctly stored and retrieved with all fields", found_quote)
                else:
                    self.log_result(test_name, False, f"Created quote not found in database. Quote ID: {quote_id}")
                    
        except Exception as e:
            self.log_result(test_name, False, f"Test failed: {str(e)}")
            
    async def test_error_handling(self):
        """Test error handling for various edge cases"""
        test_name = "Error Handling Tests"
        
        # Test malformed JSON
        try:
            async with self.session.post(
                f"{API_BASE_URL}/corporate/quote",
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
                f"{API_BASE_URL}/corporate/quote",
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
        print("=" * 60)
        print("CORPORATE QUOTE ENDPOINTS TESTING")
        print("=" * 60)
        print(f"Backend URL: {API_BASE_URL}")
        print(f"Test started at: {datetime.now().isoformat()}")
        print()
        
        await self.setup()
        
        try:
            # Test POST endpoint
            print("Testing POST /api/corporate/quote endpoint...")
            await self.test_post_corporate_quote_valid_data()
            await self.test_post_corporate_quote_missing_required_fields()
            await self.test_post_corporate_quote_invalid_data_types()
            
            print("\nTesting GET /api/corporate/quotes endpoint...")
            await self.test_get_corporate_quotes_no_auth()
            await self.test_get_corporate_quotes_with_filters()
            
            print("\nTesting database integration...")
            await self.test_database_persistence()
            
            print("\nTesting error handling...")
            await self.test_error_handling()
            
        finally:
            await self.cleanup()
            
        # Print summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
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
    tester = CorporateQuoteAPITester()
    passed, failed = await tester.run_all_tests()
    
    # Exit with error code if tests failed
    if failed > 0:
        exit(1)
    else:
        exit(0)

if __name__ == "__main__":
    asyncio.run(main())