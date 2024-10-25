import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MonthlyScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() =>{
    loadMonthlyData()
  },[])

  const loadMonthlyData = async () =>{
    const storedData =await AsyncStorage.getItem('monthlyData')
    if(storedData) setMonthlyData(JSON.parse(storedData))
  }


  const getTotalExpense = () => {
    return (monthlyData[selectedMonth]?.expense || [])
      .reduce((total, expense) => total + parseFloat(expense.amount || 0), 0)
      .toFixed(2);
  };

  const getRemainingBalance = () => {
    const incomeValue = monthlyData[selectedMonth]?.income || 0;
    const expenseValue = getTotalExpense();
    return (incomeValue - expenseValue).toFixed(2);
  };
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Report for {selectedMonth}</Text>

      <Picker
        selectedValue={selectedMonth}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
      >
        {[...Array(12)].map((_, i) => {
          const month = new Date(0, i).toLocaleString('default', { month: 'long' });
          const year = new Date().getFullYear();
          return <Picker.Item key={i} label={`${month} ${year}`} value={`${month} ${year}`} />;
        })}
      </Picker>

      <Text style={styles.report}>
        Total Income:  $
        {monthlyData[selectedMonth]?.income
          ? monthlyData[selectedMonth].income
          : '0.00'}
      </Text>
      <Text style={styles.report}>
        Total Expenses:  ${getTotalExpense()}
      </Text>
      <Text style={styles.report}>
        Remaining Balance:  ${getRemainingBalance()}
      </Text>


      <FlatList
        data={monthlyData[selectedMonth]?.expense || []} 
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.expenseItem}>
            <Text>{item.date}</Text>
            <Text>{item.description}</Text>
            <Text>${parseFloat(item.amount).toFixed(2)}</Text>
         
          </View>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  report: {
    fontSize: 16,
    marginVertical: 5,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    marginVertical: 5,
  },
});

export default MonthlyScreen;
