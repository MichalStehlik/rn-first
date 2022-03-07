import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import GoalInput from './components/GoalInput';
import GoalItem from './components/GoalItem';

// https://reactnative.dev/docs/components-and-apis
// https://reactnative.directory/?search=storage

const STORAGE_KEY = "firstApplicationStorage"

const storeData = async (data, key) => {
  const jsonValue = JSON.stringify(data)
  await AsyncStorage.setItem(key, jsonValue)
}

const loadData = async (key) => {
  const jsonValue = await AsyncStorage.getItem(key)
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}

export const App = () => {
  const [goals, setGoals] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);

  const addGoalHandler = goalTitle => {
    setGoals(currentGoals => [
      ...currentGoals,
      { id: Math.random().toString(), value: goalTitle }
    ]);
    setIsAddMode(false);
  };

  const removeGoalHandler = goalId => {
    setGoals(currentGoals => {
      return currentGoals.filter(goal => goal.id !== goalId);
    });
  };

  const cancelGoalAdditionHandler = () => {
    setIsAddMode(false);
  };

  useEffect(async () => {
    let data = await loadData(STORAGE_KEY);
    console.log(data);
    setGoals(data);
  }, []);

  useEffect(async ()=>{
    console.log("STORING", goals);
    await storeData(goals, STORAGE_KEY)
    .catch(console.error)
  },[goals]);

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Best Goals checklist application EVER!</Text>
      <Button title="Add New Goal" onPress={() => setIsAddMode(true)} />
      <GoalInput
        visible={isAddMode}
        onAddGoal={addGoalHandler}
        onCancel={cancelGoalAdditionHandler}
      />
      <FlatList 
        keyExtractor={(item, index) => item.id}
        data={goals}
        renderItem={itemData => (
          <GoalItem
            id={itemData.item.id}
            onDelete={removeGoalHandler}
            title={itemData.item.value}
          />
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50
  },
  text: {
    padding: 10,
    textAlign: "center",
    fontSize: 24
  }
});


export default App;