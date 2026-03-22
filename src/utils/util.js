function GernateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

function getOthHTML(otp) {
  return `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; border:1px solid black; padding:20px; border-radius:5px;">
        <h2 style="color:blue;">Your OTP for Login is</h2>
        <h1 style="font-size:70px; letter-spacing:10px;">${otp}</h1>
    </div>
  `;
}
module.exports = {
  GernateOTP,
  getOthHTML
}
