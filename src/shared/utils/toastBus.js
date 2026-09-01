let toastRef = null;

export const setToastRef = (ref) => {
  toastRef = ref;
};

export const showToast = {
  success: (message) => toastRef?.success(message),
  error: (message) => toastRef?.error(message),
  warning: (message) => toastRef?.warning(message),
  info: (message) => toastRef?.info(message),
};
