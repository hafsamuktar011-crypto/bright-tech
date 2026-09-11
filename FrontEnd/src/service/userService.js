import { api } from "./axiosInstance.js";

export const register = (formData) => {
  return api.post("/user/register", formData);
};

const dummyToken=""
export const registerStaff = (staffData) => {
  return api.post("/user/register-staff", staffData,{
  headers: {
    Authorization: `Bearer ${dummyToken}`,
  },}
)}
 

export const getStudents = () => {
  return api.get("/user/students-list");
};

export const getInstructors = () => {
  return api.get("/user/instructors-list");
};
