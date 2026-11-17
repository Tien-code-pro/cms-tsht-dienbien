export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("authUser"));

  if (obj && obj.data) {
    return { Authorization: obj.data };
  } else {
    return {};
  }
}
