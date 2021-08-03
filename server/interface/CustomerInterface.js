function Customerinterface() {
    this.KioskDivide = function(result, kiosk_num) {
        for(var i=0; i<result.length; i++)
        {
            if (result[i]['kiosk_num'] == kiosk_num)
                return true;
        }
        return false;
    }
}