// ===================================================
// LOGIN PAGE FUNCTIONALITY
// ===================================================


// Tab Switching
document.querySelectorAll('.auth-tab').forEach(tab=>{
tab.addEventListener('click',function(){

const targetTab=this.dataset.tab;

document.querySelectorAll('.auth-tab').forEach(
t=>t.classList.remove('active')
);

this.classList.add('active');

if(targetTab==='login'){

document.getElementById('loginForm').classList.remove('d-none');
document.getElementById('signupForm').classList.add('d-none');

document.querySelector('.auth-title').innerText='Welcome Back';
document.querySelector('.auth-subtitle').innerText='Sign in to continue your journey';

}else{

document.getElementById('loginForm').classList.add('d-none');
document.getElementById('signupForm').classList.remove('d-none');

document.querySelector('.auth-title').innerText='Join EchoVibe';
document.querySelector('.auth-subtitle').innerText='Create your account to get started';

}

});
});


// Password Toggle
function togglePassword(event,inputId){

const input=document.getElementById(inputId);

const icon=event.currentTarget.querySelector('i');

if(input.type==='password'){
input.type='text';
icon.classList.remove('fa-eye');
icon.classList.add('fa-eye-slash');
}
else{
input.type='password';
icon.classList.remove('fa-eye-slash');
icon.classList.add('fa-eye');
}

}



// Password Strength
const signupPasswordInput=document.getElementById('signupPassword');

if(signupPasswordInput){

signupPasswordInput.addEventListener('input',function(){

const password=this.value;
const strengthFill=document.getElementById('strengthFill');
const strengthText=document.getElementById('strengthText');

let strength=0;

if(password.length>=8) strength+=25;
if(password.match(/[a-z]/)) strength+=25;
if(password.match(/[A-Z]/)) strength+=25;
if(password.match(/[0-9]/)) strength+=15;
if(password.match(/[^a-zA-Z0-9]/)) strength+=10;

strengthFill.style.width=`${strength}%`;

if(strength<40){
strengthFill.style.background='#ff4444';
strengthText.innerText='Weak';
}
else if(strength<70){
strengthFill.style.background='#ffaa00';
strengthText.innerText='Medium';
}
else{
strengthFill.style.background='#00ff88';
strengthText.innerText='Strong';
}

});

}



// ======================
// LOGIN API
// ======================

document.getElementById('loginForm').addEventListener(
'submit',
async function(e){

e.preventDefault();

const email=document.getElementById('loginEmail').value;
const password=document.getElementById('loginPassword').value;

try{

const res=await fetch(
(window.ECHOVIBE_CONFIG?.API_BASE_URL ?? 'http://localhost:5000') + '/api/auth/login',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
email,
password
})
}
);

const data=await res.json();

if(!res.ok){
showErrorMessage(data.message || 'Login failed');
return;
}

localStorage.setItem('token',data.token);
localStorage.setItem('userEmail',email);
if(data.user && data.user.name) localStorage.setItem('userName',data.user.name);

showSuccessMessage('Login successful!');

setTimeout(()=>{
window.location.href='explore.html';
},1500);

}
catch(err){
console.error(err);
showErrorMessage('Server error — is the backend running?');
}

}
);



// ======================
// SIGNUP API
// ======================

document.getElementById('signupForm').addEventListener(
'submit',
async function(e){

e.preventDefault();

const name=document.getElementById('signupName').value;
const email=document.getElementById('signupEmail').value;
const username=document.getElementById('signupUsername')?.value || '';
const password=document.getElementById('signupPassword').value;

try{

const res=await fetch(
(window.ECHOVIBE_CONFIG?.API_BASE_URL ?? 'http://localhost:5000') + '/api/auth/signup',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
name,
email,
username,
password
})
}
);

const data=await res.json();

if(!res.ok){
showErrorMessage(data.message || 'Signup failed');
return;
}

showSuccessMessage('Account created successfully!');

setTimeout(()=>{
document.querySelector('[data-tab="login"]').click();
},1500);

}
catch(err){
console.error(err);
showErrorMessage('Server error — is the backend running?');
}

}
);




// Success Message
function showSuccessMessage(message){

let successMsg=document.querySelector('.success-message');

if(!successMsg){

successMsg=document.createElement('div');
successMsg.className='success-message';

const form=document.querySelector('.auth-form:not(.d-none)');
form.insertBefore(successMsg,form.firstChild);

}

successMsg.innerHTML=`
<i class="fas fa-check-circle"></i>
<span>${message}</span>
`;

successMsg.style.display='flex';

setTimeout(()=>{
successMsg.style.display='none';
},3000);

}



// Error Message
function showErrorMessage(message){

let errorMsg=document.querySelector('.error-message');

if(!errorMsg){

errorMsg=document.createElement('div');
errorMsg.className='error-message';

const form=document.querySelector('.auth-form:not(.d-none)');
form.insertBefore(errorMsg,form.firstChild);

}

errorMsg.innerHTML=`
<i class="fas fa-exclamation-circle"></i>
<span>${message}</span>
`;

errorMsg.style.display='flex';

setTimeout(()=>{
errorMsg.style.display='none';
},3000);

}



// Social buttons — show coming soon message
document.querySelectorAll('.social-btn').forEach(btn=>{
btn.addEventListener('click',function(){

const provider=this.querySelector('span').innerText;

showErrorMessage(
`${provider} login coming soon! Use email for now.`
);

});
});



// Logged-in check
window.addEventListener('DOMContentLoaded',()=>{

const token=localStorage.getItem('token');

if(token){
console.log('User authenticated');
}

});



// Input animations
document.querySelectorAll('.form-control-custom').forEach(input=>{

input.addEventListener('focus',function(){
this.parentElement.querySelector('.input-icon').style.color='#bc13fe';
});

input.addEventListener('blur',function(){
this.parentElement.querySelector('.input-icon').style.color='#666';
});

});