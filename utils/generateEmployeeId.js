
const generateEmployeeId = () => {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'UI';
    for (let i = 0; i < 7; i++) {
      id += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    return id;
  };
  
  export default generateEmployeeId;