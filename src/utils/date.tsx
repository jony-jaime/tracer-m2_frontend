import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

const formattedDate = (date: string, format: string = "ddd, MMM D, YYYY") => dayjs.utc(date).format(format);

export default formattedDate;
