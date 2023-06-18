import { ReactElement, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { Game } from 'src/Game'
import { Gamepad } from 'src/Gamepad'

const SPEED = 4

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'center',
    color: 'brown'
  }
})

export default function App(): ReactElement {
  const dx = useRef(0)
  const dy = useRef(0)
  const [textXY, setTextXY] = useState('0, 0')

  const x = useSharedValue(0)
  const y = useSharedValue(0)

  useEffect(() => {
    const interval = setInterval(() => {
      x.value += dx.current * SPEED
      y.value += dy.current * SPEED
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const onChange = (_dx, _dy) => {
    setTextXY(`${_dx.toFixed(3)}, ${_dy.toFixed(3)}`)
    dx.current = _dx
    dy.current = _dy
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>{textXY}</Text>
        <Game x={x} y={y} />
        <Gamepad onChange={onChange} />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
