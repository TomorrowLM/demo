import { B3DisplayFormat } from '../../lib/B3DateFormat'
import DateTime from '../../common/utils/DateTime'

export default date => date ? B3DisplayFormat(DateTime.getStoreZoneDate(new Date(date))) : date