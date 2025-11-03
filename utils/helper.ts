export function generateRandomEmail(): string {
  const timestamp = new Date().getTime();
  return `user_${timestamp}@test.com`;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}