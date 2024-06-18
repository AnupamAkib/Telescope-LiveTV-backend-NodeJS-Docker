const onlyAlphaLetters = (v) => {
    for(let i=0; i<v.length; i++){
        if(v[i] == ' ' || v[i] == '.') continue;
        if(!((v[i]>='a' && v[i]<='z') || (v[i]>='A' && v[i]<='Z'))) return false;
    }
    return true;
}

const onlyNumber = (v) => {
    for(let i=0; i<v.length; i++){
        if((v[i]>='a' && v[i]<='z') || (v[i]>='A' && v[i]<='Z')) return true;
    }
    return false;
}

const isLengthValid = (minLength, maxLength) => {
    return (input) => {
      return input.length >= minLength && input.length <= maxLength;
    };
};

const isValidUsername = (v) => {
    for(let i=0; i<v.length; i++){
        if(v[i] == ' ') return false;
    }
    return true;
}

const isValidPhoneNumber = (v) => {
    if(v.length != 11) return false;
    if(!(v[0]=='0' && v[1]=='1')) return false;
    for(let i=0; i<v.length; i++){
        if(!(v[i]>='0' && v[i]<='9')){
            return false;
        }
    }
    return true;
}

const isEmailValid = (v) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Function to capitalize the first letter of each word
function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

module.exports = {
    onlyAlphaLetters,
    isLengthValid,
    onlyNumber,
    isValidUsername,
    isValidPhoneNumber,
    isEmailValid,
    capitalizeFirstLetter
}