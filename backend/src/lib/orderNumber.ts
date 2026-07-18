type OrderNumberOptions = {
  prefix?: string;
  randomLength?: number;
  date?: Date;
};

const DEFAULT_PREFIX = "ORD";
const DEFAULT_RANDOM_LENGTH = 8;

function formatDatePart(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function randomSuffix(length: number): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, length).toUpperCase();
}

function generateOrderNumber(options: OrderNumberOptions = {}): string {
  const {
    prefix = DEFAULT_PREFIX,
    randomLength = DEFAULT_RANDOM_LENGTH,
    date = new Date(),
  } = options;

  return `${prefix}-${formatDatePart(date)}-${randomSuffix(randomLength)}`;
}

export default generateOrderNumber;
