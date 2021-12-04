export default {
    checkPhone(phone) { 
        if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){ 
            return false; 
        } 
        return true;
    },
    stampChangehHonurs: function () {
      let hou = new Date().getHours();
      let min = new Date().getMinutes();
      let sec = new Date().getSeconds();
      return `${this.add0(hou)}:${this.add0(min)}:${this.add0(sec)}`;
    },
    add0 (m) { return m < 10 ? '0' + m : m },
    timeChangeDate(time) {
        let times = new Date(time);
        return `${times.getFullYear()}-${times.getMonth() + 1}-${times.getDate()}`
    },
    
}