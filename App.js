import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function App() {
  const API_KEY = 'ff26d804d0d9d838fc3e57227eed4bcc';
  const [location, setLocation] = useState([]);
  const [daily, setDaily] = useState([]);
  const [error, setError] = useState(null);
  const weatherIcons = {
    Clear: 'day-sunny',
    Clouds: 'cloudy',
    Rain: 'rain',
    Atmosphere: 'cloudy-gusts',
    Snow: 'snow',
    Drizzle: 'day-rain',
    Thunderstorm: 'lightning',
  };

  const handleGetWeather = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return setError('Permission to access location was denied.');
    } else {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const location = await Location.reverseGeocodeAsync(
        { latitude, longitude },
        { useGoogleMaps: false }
      );
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      );
      setLocation(location[0]);
      setDaily(response.data.daily);
    }
  };

  useEffect(() => {
    handleGetWeather();
  }, []);

  return (
    <>
      {error ? (
        <Text>Permission to access location was denied.</Text>
      ) : (
        <>
          <StatusBar style="light" />
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Text style={styles.region}>{location?.region}</Text>
              <Text style={styles.city}>
                {location?.city} {location?.district}
              </Text>
            </View>
            <ScrollView
              style={styles.scrollView}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              indicatorStyle="black"
            >
              {daily?.length === 0 ? (
                <ActivityIndicator
                  size="large"
                  color="white"
                  style={{ width: width, marginBottom: 200 }}
                ></ActivityIndicator>
              ) : (
                <>
                  {daily?.length > 0 &&
                    daily?.map((daily, index) => (
                      <View style={styles.weatherContainer} key={index}>
                        <Fontisto
                          name={
                            weatherIcons[daily?.weather[0].main]
                              ? weatherIcons[daily?.weather[0].main]
                              : 'cloudy-gusts'
                          }
                          size={150}
                          color="white"
                        />
                        <Text style={styles.dates}>
                          {new Date(daily?.dt * 1000)
                            .toString()
                            .substring(0, 10)}
                        </Text>
                        <Text style={styles.weatherMain}>
                          {daily?.weather[0].main}
                        </Text>
                        <Text style={styles.weatherDesc}>
                          {daily?.weather[0].description}
                        </Text>
                        <Text style={styles.temp}>
                          {Math.ceil(daily?.temp.max)}°
                        </Text>
                      </View>
                    ))}
                </>
              )}
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `#00b894`,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  region: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  city: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 7,
  },
  bottomContainer: {
    flex: 3,
  },
  weatherContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  dates: {
    fontSize: 30,
    color: 'white',
    marginTop: 20,
  },
  weatherMain: {
    fontSize: 50,
    color: 'white',
    marginTop: 10,
    marginBottom: 2,
  },
  weatherDesc: {
    fontSize: 30,
    color: 'white',
  },
  temp: {
    fontSize: 75,
    color: 'white',
    marginTop: 20,
  },
});
