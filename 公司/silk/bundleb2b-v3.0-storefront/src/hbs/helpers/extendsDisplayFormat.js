import { B3ExtendsDisplayFormat } from '../../lib/B3DateFormat'

export default date => date ? B3ExtendsDisplayFormat(new Date(date)) : date