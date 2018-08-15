let isMove = false
export default (click, move) => {
  return {
    onMouseDown: () => {
      isMove = false
    },
    onMouseMove: () => {
      isMove = true
    },
    onMouseUp: e => {
      if (isMove) {
        move && move(e)
        isMove = false
      } else {
        click && click(e)
      }
    }
  }
}
