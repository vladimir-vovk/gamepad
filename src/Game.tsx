import { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming
} from 'react-native-reanimated'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 24
  },
  board: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center'
  },
  player: {
    width: 48,
    height: 48,
    backgroundColor: 'purple'
  }
})

type Props = {
  x: SharedValue<number>
  y: SharedValue<number>
}

export const Game = ({ x, y }: Props): ReactElement => {
  const aStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(x.value) }, { translateY: withTiming(y.value) }]
  }))

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.board}>
        <Animated.View style={[styles.player, aStyles]} />
      </Animated.View>
    </Animated.View>
  )
}
