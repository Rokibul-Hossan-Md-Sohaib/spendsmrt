import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YearlyScreen = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [yearlyIncome, setYearlyIncome] = useState(0);
  console.log(yearlyIncome)
  const [yearlyExpense, setYearlyExpense] = useState(0);
  const [yearlyBalance, setYearlyBalance] = useState(0);

  useEffect(() => {
    loadMonthlyData();
  }, []);

  const loadMonthlyData = async () => {
    const storedData = await AsyncStorage.getItem('monthlyData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMonthlyData(parsedData);
      calculateYearlySummary(parsedData);
    }
  };

  const calculateYearlySummary = (data) => {
    let totalIncome = 0; 
    let totalExpense = 0; 
  
    for (let i = 0; i < 12; i++) {
      const month = new Date(0, i).toLocaleString('default', { month: 'long' });
      const year = new Date().getFullYear();
  
      const monthKey = `${month} ${year}`;
      const income = parseFloat(data[monthKey]?.income) || 0;
      const expense = data[monthKey]?.expense || [];
  
      const totalMonthExpense = expense.reduce((total, expense) => {
        const amount = parseFloat(expense.amount) || 0;
        return total + amount;
      }, 0);
  
      totalIncome += income;
      totalExpense += totalMonthExpense;
    }
  
    const remainingBalance = totalIncome - totalExpense;
  
    setYearlyIncome(totalIncome.toFixed(2));
    setYearlyExpense(totalExpense.toFixed(2));
    setYearlyBalance(remainingBalance.toFixed(2));
  };


  const getYearlySummary = () => {
    const summary = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(0, i).toLocaleString('default', { month: 'long' });
      const year = new Date().getFullYear();
      const monthKey = `${month} ${year}`;

      const income = parseFloat(monthlyData[monthKey]?.income) || 0;
      const expenses = monthlyData[monthKey]?.expense || [];

      const totalExpense = expenses.reduce((total, expense) => {
        const amount = parseFloat(expense.amount) || 0;
        return total + amount;
      }, 0).toFixed(2);

      summary.push({ month: monthKey, income: income.toFixed(2), totalExpense });
    }
    return summary;
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yearly Report</Text>


      <View style={styles.yearlySummary}>
        <Text style={styles.summaryText}>Total Income: ${yearlyIncome}</Text>
        <Text style={styles.summaryText}>Total Expense: ${yearlyExpense}</Text>
        <Text style={styles.summaryText}>Remaining Balance: ${yearlyBalance}</Text>
      </View>

      <FlatList
        data={getYearlySummary()}
        keyExtractor={(item) => item.month}
        renderItem={({ item }) => (
          <View style={styles.monthItem}>
            <Text>{item.month}</Text>
            <Text>Income: ${item.income}</Text>
            <Text>Total Expense: ${item.totalExpense}</Text>
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
  yearlySummary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  monthItem: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
 
});

export default YearlyScreen;
