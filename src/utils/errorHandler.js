export const wrap = fn => async (...args) => {
  try {
    return await fn(...args);
  } catch (e) {
    console.error("❌ Unhandled Error:", e.message);
    process.exit(1);
  }
};