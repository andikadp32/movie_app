import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

export default function Home({ navigation }: any): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Movie Page</Text>
      <Button
        title="PERGI KE MOVIE DETAIL"
        onPress={() => navigation.navigate('MovieDetail')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  }
})