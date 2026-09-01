// Small fetch wrapper for talking to the BackEnd API.
// Uses cookies (httpOnly access/refresh tokens set by the server) instead of
// a token in localStorage, so every request must be sent with credentials:"include".



const BASE_URL = "http://localhost:5000/api"

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // some endpoints may return no body
  }

  if (!res.ok) {
    const message =
      (data && (data.message || (Array.isArray(data.message) && data.message[0]?.message))) ||
      `Request failed with status ${res.status}`
    throw new Error(typeof message === "string" ? message : "Request failed")
  }

  return data
}

export const api = {
  login: (emailAddress, password) =>
    request("/auth/login", { method: "POST", body: { emailAddress, password } }),
  register: (formData) =>
    request("/user/register", { method: "POST", body: formData }),
  logout: () => request("/auth/logout", { method: "POST" }),
  registerStaff:(staffData)=>
    request("/user/register-staff",{method:"POST",body:staffData}),
  getStudents:() =>
    request("/user/students-list",{method:"GET"}),
}

export default api
