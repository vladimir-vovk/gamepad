import { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

const GAMEPAD_SIZE = 240
const STICK_SIZE = GAMEPAD_SIZE / 3
const COLOR = 'lightblue'

const styles = StyleSheet.create({
  border: {
    borderWidth: 4,
    borderColor: COLOR,
    width: GAMEPAD_SIZE,
    height: GAMEPAD_SIZE,
    borderRadius: GAMEPAD_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stick: {
    width: STICK_SIZE,
    height: STICK_SIZE,
    borderRadius: STICK_SIZE / 2,
    backgroundColor: COLOR
  }
})

type Props = {
  onChange: (x, y) => void
}

type Context = {
  translateX: number
  translateY: number
}

export const Gamepad = ({ onChange }: Props): ReactElement => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, Context>({
    onStart: (_, context) => {
      context.translateX = translateX.value
      context.translateY = translateY.value
    },
    onActive: (e, context) => {
      const r = GAMEPAD_SIZE / 2 - STICK_SIZE / 2
      const nextX = e.translationX + context.translateX
      const nextY = e.translationY + context.translateY
      const angle = Math.atan(Math.abs(nextY) / Math.abs(nextX))
      let x = 0
      let y = 0

      if (e.translationX >= 0 && e.translationY <= 0) {
        /* move right and up */
        const maxX = Math.cos(angle) * r
        const maxY = -1 * Math.sin(angle) * r
        x = nextX > maxX ? maxX : nextX
        y = Math.abs(nextY) > Math.abs(maxY) ? maxY : nextY
      } else if (e.translationX >= 0 && e.translationY >= 0) {
        /* move right and down */
        const maxX = Math.cos(angle) * r
        const maxY = Math.sin(angle) * r
        x = nextX > maxX ? maxX : nextX
        y = nextY > maxY ? maxY : nextY
      } else if (e.translationX <= 0 && e.translationY >= 0) {
        /* move left and down */
        const maxX = -1 * Math.cos(angle) * r
        const maxY = Math.sin(angle) * r
        x = Math.abs(nextX) > Math.abs(maxX) ? maxX : nextX
        y = nextY > maxY ? maxY : nextY
      } else if (e.translationX <= 0 && e.translationY <= 0) {
        /* move left and up */
        const maxX = -1 * Math.cos(angle) * r
        const maxY = -1 * Math.sin(angle) * r
        x = Math.abs(nextX) > Math.abs(maxX) ? maxX : nextX
        y = Math.abs(nextY) > Math.abs(maxY) ? maxY : nextY
      }

      translateX.value = x
      translateY.value = y

      runOnJS(onChange)(x / r, y / r)
    },
    onEnd: () => {
      translateX.value = withSpring(0)
      translateY.value = withSpring(0)
      runOnJS(onChange)(0, 0)
    }
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }]
  }))

  return (
    <View style={styles.border}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.stick, animatedStyle]} />
      </PanGestureHandler>
    </View>
  )
}
