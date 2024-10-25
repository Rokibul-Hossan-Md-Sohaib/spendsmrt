import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY ='monthlyData'


export const loadMonthlyData = async() =>{
    try {
        const storedData =await AsyncStorage.getItem(STORAGE_KEY)
        console.log("loadData", storedData)
        return storedData ? JSON.parse(storedData): {}
        
    } catch (error) {
        console.log("Failed to load", error)
    }
}

export const saveMonthlyData = async (data) =>{
    console.log("data", data)
    try {
        await AsyncStorage.setItem(STORAGE_KEY , JSON.stringify(data))
        
    } catch (error) {
        console.log("Failed to save", error)
    }
}