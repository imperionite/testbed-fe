import toast from "react-hot-toast";

const notify = {
  success(message) {
    toast.success(message);
  },

  error(message) {
    toast.error(message);
  },

  info(message) {
    toast.info(message);
  },

  warning(message) {
    toast(message, {
      icon: "⚠️",
    });
  },
};

export default notify;
