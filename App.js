import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();

const diseaseData = [
  { name: "당뇨", description: "인슐린의 분비량이 부족하거나 정상적인 기능이 이루어지지 않는 등의 대사질환의 일종\n관련 증상: 무감각증, 소양감, 변비, 저혈압, 거품뇨, 단백뇨\n응급처치: 저형당 환자는 과일 주스나 캔디, 당분이 든 음료 섭취, 고혈당 환자는 인슐린이나 당뇨약 섭취 후 15분이 지나도 증상의 회복이 없으면 응급실로 후송" },
  { name: "고지혈증", description: "혈액 내에 지방성분이 정상보다 많은 상태\n관련 증상: 대부분 증상이 없음\n응급처치: 콜레스테롤 수치 관리" },
  { name: "뇌출혈", description: "고혈압에 의해 발생한 자발성 뇌내출혈\n관련 증상: 두통, 안면 신경마비, 구역, 무감각증, 실어증, 편측 마비, 호흡장애, 구토\n응급처치: 머리를 돌려주어 기도를 확보해주고 구토 시에는 바로 눕힌 상태에서 목을 옆으로 돌리고 손가락을 이용해 토물을 제거해야 한다. 즉시 119에 전화하고 도착할 때까지 기다린다." },
  { name: "업데이트 중 ...", description: "" },
  // Add more disease data as needed...
];

const HospitalData = [
  { name: "노인 돌봄 서비스", description: "만 65세 이상 일상생활 영위가 어려운 취약노인에게 적절한 돌봄서비스를 제공하여 안정적인 노후생활 보장, 노인의 기능 및 건강 유지 및 악화 예방" },
  { name: "치매안심센터", description: "치매 환자의 등록 및 관리, 환자 쉼터 운영, 치매 환자 가족 지원 사업 등을 운영" },
  { name: "업데이트 중 ...", description: "" },
  // Add more disease data as needed...
];


const InitialScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [disease, setDisease] = useState('');

  const handleSubmit = () => {
    navigation.navigate('Home', {
      userData: { name, age, disease }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input}
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
      />
      <TextInput 
        style={styles.input}
        placeholder="Enter your disease"
        value={disease}
        onChangeText={setDisease}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const Home = ({ navigation, route }) => {
  const userData = route.params?.userData;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { userData })}>
          <Text style={{ marginRight: 10, color: 'blue' }}>Profile</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, userData]);

  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [steps, setSteps] = useState(0);
  const [activityLevel, setActivityLevel] = useState('Low');
  const [stability, setStability] = useState('Stable');
  const [challengeStatus, setChallengeStatus] = useState('InProgress');

  useEffect(() => {
    Accelerometer.setUpdateInterval(1000);

    const accelerometerSubscription = Accelerometer.addListener(accelerometerData => {
      console.log(accelerometerData);
      setData(accelerometerData);
      const totalForce = Math.sqrt(
        Math.pow(accelerometerData.x, 2) +
        Math.pow(accelerometerData.y, 2) +
        Math.pow(accelerometerData.z, 2)
      );

      if (totalForce > 1.2) {
        setSteps(prevSteps => prevSteps + 1);
      }

      if (totalForce > 1.5) {
        setActivityLevel('High');
      } else if (totalForce > 1.2) {
        setActivityLevel('Medium');
      } else {
        setActivityLevel('Low');
      }

      if (steps < 1000) {
        setStability('Low');
      } else if (steps > 5000) {
        setStability('High');
      } else {
        setStability('Stable');
      }

      if (steps > 10000) {
        setChallengeStatus('Completed');
      } else {
        setChallengeStatus('InProgress');
      }
    });

    return () => {
      accelerometerSubscription && accelerometerSubscription.remove();
    };
  }, [steps]);

  const handleIconPress = (pageName) => {
    navigation.navigate(pageName, { userData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TODAY</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Steps</Text>
        <Text style={styles.value}>{steps}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Activity Level</Text>
        <Text style={styles.value}>{activityLevel}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Stability</Text>
        <Text style={styles.value}>{stability}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Challenge Status</Text>
        <Text style={styles.value}>{challengeStatus}</Text>
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleIconPress('Hospital')}>
          <MaterialIcons name="local-hospital" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => handleIconPress('Search')}>
          <MaterialIcons
 name="search" size={24} color="#333" />
 </TouchableOpacity>
 <TouchableOpacity style={styles.tabItem} onPress={() => handleIconPress('Challenge')}>
   <MaterialIcons name="star" size={24} color="#333" />
 </TouchableOpacity>
 <TouchableOpacity style={styles.tabItem} onPress={() => handleIconPress('Profile')}>
   <MaterialIcons name="person" size={24} color="#333" />
 </TouchableOpacity>
</View>
</View>
);
};


const HospitalScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {HospitalData.map((Hospital, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{Hospital.name}</Text>
          <Text style={styles.value}>{Hospital.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const SearchScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {diseaseData.map((disease, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{disease.name}</Text>
          <Text style={styles.value}>{disease.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

//const ChallengeScreen = () => <View><Text>Challenge Screen</Text></View>
const ProfileScreen = ({ route }) => {
  const { userData } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>Profile</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.profileLabel}>Name:</Text>
          <Text style={styles.profileValue}>{userData.name}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileLabel}>Age:</Text>
          <Text style={styles.profileValue}>{userData.age}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileLabel}>Disease:</Text>
          <Text style={styles.profileValue}>{userData.disease}</Text>
        </View>
      </View>
    </View>
  );
};

const ChallengeScreen = ({ navigation }) => {
  const [water, setWater] = useState(false);
  const [exercise, setExercise] = useState(false);
  const [medicine, setMedicine] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={{ marginRight: 10, color: 'blue' }}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Today's Challenge</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Drink Water</Text>
        <TouchableOpacity style={water ? styles.checkedBox : styles.checkBox} onPress={() => setWater(!water)} />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Exercise</Text>
        <TouchableOpacity style={exercise ? styles.checkedBox : styles.checkBox} onPress={() => setExercise(!exercise)} />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Take Medicine</Text>
        <TouchableOpacity style={medicine ? styles.checkedBox : styles.checkBox} onPress={() => setMedicine(!medicine)} />
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Initial" component={InitialScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Hospital" component={HospitalScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Challenge" component={ChallengeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor:'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  header: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '200',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },

  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 5,
  },
  checkedBox: {
    width: 24,
    height: 24,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profileLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  profileValue: {
    fontSize: 20,
    fontWeight: '200',
    color: '#333',
  },
});

export default App;