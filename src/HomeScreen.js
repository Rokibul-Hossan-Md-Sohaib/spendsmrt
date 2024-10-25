import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import {loadMonthlyData, saveMonthlyData} from '../utils/storage';

const HomeScreen = ({navigation}) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('default', {month: 'long', year: 'numeric'}),
  );
  const [income, setIncome] = useState('');
  const [monthlyData, setMonthlyData] = useState({});
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadMonthlyData();
      console.log(data);
      setMonthlyData(data);
    };
    fetchData();
  }, []);

  const handleSaveIncome = () => {
    Alert.alert(
      'Save your income',
      ' Do you want to save your income',

      [
        {text: 'cancel', style: 'cancel'},
        {text: 'ok', onPress: () => saveIncome()},
      ],
    );
  };

  const saveIncome = async () => {
    const currentIncome = monthlyData[selectedMonth]?.income || 0;
    const newIncome = parseFloat(income) + currentIncome;

    const monthData = {
      income: newIncome,
      expence: monthlyData[selectedMonth]?.expense || [],
    };
    const updatedData = {...monthlyData, [selectedMonth]: monthData};
    setMonthlyData(updatedData);

    await saveMonthlyData(updatedData);
    setIncome('');
  };

  const saveExoense = async () => {
    const newExpense = {
      id: Date.now().toString(),
      description,
      amount,
      date: new Date().toLocaleDateString(),
    };
    const monthExpense = monthlyData[selectedMonth]?.expense || [];
    monthExpense.push(newExpense);
    const updatedData = {
      ...monthlyData,
      [selectedMonth]: {
        ...monthlyData[selectedMonth],
        expense: monthExpense,
      },
    };

    setMonthlyData(updatedData);
    await saveMonthlyData(updatedData);
    setAmount('');
    setDescription('');
  };

  const deleteExpense = async id => {
    const monthExpenses = monthlyData[selectedMonth]?.expense || [];
    const updatedExpenses = monthExpenses.filter(expense => expense.id !== id);

    const updatedData = {
      ...monthlyData,
      [selectedMonth]: {
        ...monthlyData[selectedMonth],
        expense: updatedExpenses,
      },
    };

    setMonthlyData(updatedData);
    await saveMonthlyData(updatedData);
  };

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

  const navigateToMonthlyScreen = () => {
    navigation.navigate('Monthly');
  };

  const navigateToYearlyScreen = () => {
    navigation.navigate('Yearly');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spend Smart</Text>
      <Text style={styles.subtitle}>Month Select</Text>

      <Picker
        selectedValue={selectedMonth}
        onValueChange={itemValue => setSelectedMonth(itemValue)}>
        {[...Array(12)].map((_, i) => {
          const month = new Date(0, i).toLocaleString('default', {
            month: 'long',
          });
          const year = new Date().getFullYear();
          return (
            <Picker.Item
              key={i}
              label={`${month} ${year}`}
              value={`${month} ${year}`}
            />
          );
        })}
      </Picker>

      <Text style={styles.subtitle}>Monthly Income</Text>
      <TextInput
        placeholder="Income"
        keyboardType="numeric"
        value={income}
        onChangeText={text => setIncome(text)}
        style={styles.input}
      />
      <Button title="Save Income" onPress={handleSaveIncome} />

      <Text style={[styles.subtitle, {marginVertical: 10}]}>
        Add your daily expense
      </Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <Button title="Add Expense" onPress={saveExoense} />

      <Text style={styles.report}>
        Total Income : $
        {monthlyData[selectedMonth]?.income
          ? monthlyData[selectedMonth].income
          : '0.00'}
      </Text>
      <Text style={styles.report}>Total Expence: ${getTotalExpense()}</Text>
      <Text style={styles.report}>
        {' '}
        Remaing Balace: ${getRemainingBalance()}
      </Text>

      <FlatList
        data={monthlyData[selectedMonth]?.expense || []} 
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.expenseItem}>
            <Text>{item.date}</Text>
            <Text>{item.description}</Text>
            <Text>${parseFloat(item.amount).toFixed(2)}</Text>
            <Button
              title="Delete"
              onPress={() => deleteExpense(item.id)}
              color="red"
            />
          </View>
        )}
      />

      <View style={styles.navigationButtons}>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={navigateToMonthlyScreen}>
          <Text style={styles.navButtonText}>View Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={navigateToYearlyScreen}>
          <Text style={styles.navButtonText}>View Yearly</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

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
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  navButtonText: {
    textAlign: 'center',
  },
});
