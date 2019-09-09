import { NamedObject } from './NamedObject'

export class ViewConfig extends NamedObject {
  constructor ({ name, routine, props }) {
    super(name)
    this.routine = routine
    this.props = props
  }
}
