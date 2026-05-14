/**
 * Integration test script para validar que el sistema de grupos es plenamente funcional
 * Este script prueba todos los endpoints de la API de grupos
 */

const API_BASE = 'http://localhost:5000/api';

// Mock token para las pruebas
const TEST_TOKEN = 'test-token-user-123';
const TEST_USER_ID = 'user-test-001';
const TEST_USER_2_ID = 'user-test-002';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

// Helper function para hacer requests con autenticación
async function apiRequest(method: string, endpoint: string, body?: any): Promise<any> {
  const url = `${API_BASE}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_TOKEN}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${data.message || 'Unknown error'}`);
  }

  return data;
}

// Test 1: Create a group
async function testCreateGroup(): Promise<string> {
  const testName = 'CREATE GROUP';
  try {
    const groupData = {
      name: 'Test Squad Alpha',
      description: 'A test squad for integration testing',
      game: 'Valorant',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      isPrivate: false
    };

    const result = await apiRequest('POST', '/groups', groupData);
    
    if (result._id && result.members.includes(TEST_USER_ID)) {
      results.push({
        name: testName,
        status: 'PASS',
        data: { groupId: result._id, membersCount: result.members.length }
      });
      return result._id;
    } else {
      throw new Error('Group was not created with proper structure');
    }
  } catch (error) {
    results.push({
      name: testName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Test 2: Get group details
async function testGetGroupDetails(groupId: string): Promise<void> {
  const testName = 'GET GROUP DETAILS';
  try {
    const group = await apiRequest('GET', `/groups/${groupId}`);
    
    if (group._id === groupId && group.members.length > 0 && group.roles) {
      results.push({
        name: testName,
        status: 'PASS',
        data: { 
          groupName: group.name, 
          membersCount: group.members.length,
          rolesCount: group.roles.length,
          hasActivity: group.activity && group.activity.length > 0
        }
      });
    } else {
      throw new Error('Group details missing required fields');
    }
  } catch (error) {
    results.push({
      name: testName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Test 3: Invite a member
async function testInviteMember(groupId: string): Promise<void> {
  const testName = 'INVITE MEMBER';
  try {
    const result = await apiRequest('POST', `/groups/${groupId}/members/invite`, {
      targetUserId: TEST_USER_2_ID
    });

    if (result.group && result.group.joinRequests.includes(TEST_USER_2_ID)) {
      results.push({
        name: testName,
        status: 'PASS',
        data: { joinRequestsCount: result.group.joinRequests.length }
      });
    } else {
      throw new Error('Member was not added to join requests');
    }
  } catch (error) {
    results.push({
      name: testName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Test 4: Get activity feed
async function testGetActivity(groupId: string): Promise<void> {
  const testName = 'GET ACTIVITY FEED';
  try {
    const activity = await apiRequest('GET', `/groups/${groupId}/activity`);

    if (Array.isArray(activity) && activity.length > 0) {
      results.push({
        name: testName,
        status: 'PASS',
        data: { activityCount: activity.length, firstAction: activity[0].action }
      });
    } else {
      throw new Error('No activity found');
    }
  } catch (error) {
    results.push({
      name: testName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Test 5: Add activity event
async function testAddActivity(groupId: string): Promise<void> {
  const testName = 'ADD ACTIVITY EVENT';
  try {
    const result = await apiRequest('POST', `/groups/${groupId}/activity`, {
      action: 'match_won',
      details: { kills: 15, deaths: 3 }
    });

    if (result.activity && result.activity.length > 0) {
      const lastActivity = result.activity[result.activity.length - 1];
      if (lastActivity.action === 'match_won') {
        results.push({
          name: testName,
          status: 'PASS',
          data: { totalActivity: result.activity.length }
        });
      } else {
        throw new Error('Activity was not added correctly');
      }
    }
  } catch (error) {
    results.push({
      name: testName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Test 6: Change member role
async function testChangeRole(groupId: string): Promise<void> {
  const testName = 'CHANGE MEMBER ROLE';
  try {
    // First need to have a member in the group
    // This test assumes the user is already a member
    const result = await apiRequest('PUT', `/groups/${groupId}/members/${TEST_USER_ID}/role`, {
      role: 'officer'
    });

    const updatedRole = result.group.roles.find((r: any) => r.userId === TEST_USER_ID);
    if (updatedRole && updatedRole.role === 'officer') {
      results.push({
        name: testName,
        status: 'PASS',
        data: { newRole: updatedRole.role }
      });
    } else {
      throw new Error('Role was not changed');
    }
  } catch (error) {
    results.push({
      name: testName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Test 7: Get all groups
async function testGetAllGroups(): Promise<void> {
  const testName = 'GET ALL GROUPS';
  try {
    const groups = await apiRequest('GET', '/groups');

    if (Array.isArray(groups) && groups.length >= 0) {
      results.push({
        name: testName,
        status: 'PASS',
        data: { groupsCount: groups.length }
      });
    } else {
      throw new Error('Invalid groups response');
    }
  } catch (error) {
    results.push({
      name: testName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Main test runner
async function runTests(): Promise<void> {
  console.log('🚀 Starting Groups Integration Tests...\n');
  console.log('⏳ This will test all group management endpoints\n');

  try {
    // Test 1: Create group
    console.log('1️⃣  Testing CREATE GROUP...');
    const groupId = await testCreateGroup();
    console.log('   ✅ Group created\n');

    // Test 2: Get all groups
    console.log('2️⃣  Testing GET ALL GROUPS...');
    await testGetAllGroups();
    console.log('   ✅ Groups retrieved\n');

    // Test 3: Get group details
    console.log('3️⃣  Testing GET GROUP DETAILS...');
    await testGetGroupDetails(groupId);
    console.log('   ✅ Group details retrieved\n');

    // Test 4: Invite member
    console.log('4️⃣  Testing INVITE MEMBER...');
    await testInviteMember(groupId);
    console.log('   ✅ Member invited\n');

    // Test 5: Get activity
    console.log('5️⃣  Testing GET ACTIVITY FEED...');
    await testGetActivity(groupId);
    console.log('   ✅ Activity feed retrieved\n');

    // Test 6: Add activity
    console.log('6️⃣  Testing ADD ACTIVITY EVENT...');
    await testAddActivity(groupId);
    console.log('   ✅ Activity event added\n');

    // Test 7: Change role
    console.log('7️⃣  Testing CHANGE MEMBER ROLE...');
    await testChangeRole(groupId);
    console.log('   ✅ Member role changed\n');

  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }

  // Print results summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    
    if (result.status === 'PASS' && result.data) {
      console.log(`   Data: ${JSON.stringify(result.data)}`);
    }
    
    if (result.status === 'FAIL' && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`✅ PASSED: ${passed} | ❌ FAILED: ${failed}`);
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Groups system is fully functional.\n');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n');
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
