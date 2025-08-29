const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testUserManagement() {
  try {
    console.log('🧪 Testing User Management Functionality...\n');

    // Test 1: Login as admin
    console.log('1. Testing login as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@esirv2.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login successful\n');

    // Test 2: Get all users
    console.log('2. Testing get all users...');
    const usersResponse = await axios.get(`${BASE_URL}/auth/users`, { headers });
    
    if (usersResponse.data.success) {
      console.log(`✅ Found ${usersResponse.data.data.length} users`);
      console.log('Users:', usersResponse.data.data.map(u => ({ id: u.id, nama: u.nama_lengkap, role: u.role })));
    } else {
      throw new Error('Failed to get users');
    }
    console.log('');

    // Test 3: Get faskes for dropdown
    console.log('3. Testing get faskes...');
    const faskesResponse = await axios.get(`${BASE_URL}/faskes`, { headers });
    
    if (faskesResponse.data.success) {
      console.log(`✅ Found ${faskesResponse.data.data.length} faskes`);
    } else {
      console.log('⚠️ Failed to get faskes (not critical)');
    }
    console.log('');

    // Test 4: Create new user
    console.log('4. Testing create new user...');
    const newUserData = {
      nama_lengkap: 'Test User',
      email: 'testuser@example.com',
      password: 'test123',
      role: 'admin_faskes',
      faskes_id: faskesResponse.data.success ? faskesResponse.data.data[0]?.id : null,
      telepon: '08123456789'
    };

    const createResponse = await axios.post(`${BASE_URL}/auth/users`, newUserData, { headers });
    
    if (createResponse.data.success) {
      console.log('✅ User created successfully');
      const newUserId = createResponse.data.data.id;
      console.log('New user ID:', newUserId);
      console.log('');

      // Test 5: Update user
      console.log('5. Testing update user...');
      const updateData = {
        nama_lengkap: 'Test User Updated',
        email: 'testuser@example.com',
        role: 'admin_faskes',
        faskes_id: faskesResponse.data.success ? faskesResponse.data.data[0]?.id : null,
        telepon: '08123456789'
      };

      const updateResponse = await axios.put(`${BASE_URL}/auth/users/${newUserId}`, updateData, { headers });
      
      if (updateResponse.data.success) {
        console.log('✅ User updated successfully');
        console.log('');

        // Test 6: Delete user
        console.log('6. Testing delete user...');
        const deleteResponse = await axios.delete(`${BASE_URL}/auth/users/${newUserId}`, { headers });
        
        if (deleteResponse.data.success) {
          console.log('✅ User deleted successfully');
        } else {
          throw new Error('Failed to delete user');
        }
      } else {
        throw new Error('Failed to update user');
      }
    } else {
      throw new Error('Failed to create user');
    }

    console.log('\n🎉 All user management tests passed!');
    console.log('✅ Add, Edit, and Delete user functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('💡 Make sure you are logged in as admin_pusat');
    }
    
    if (error.response?.status === 500) {
      console.log('💡 Check if the backend server is running');
    }
  }
}

// Run the test
testUserManagement();
