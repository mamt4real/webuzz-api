exports.getGrade = (totalMark) =>{
    switch(true){
        case(totalMark>69):
            return "A";
        case(totalMark>59):
            return "B";
        case(totalMark>49):
            return "C";
        case(totalMark>44):
            return "D";
        default:
            return "F";
    }
}

exports.getRemark = (totalMark) =>{
    switch(true){
        case(totalMark>69):
            return "Excellent";
        case(totalMark>59):
            return "Very Good";
        case(totalMark>49):
            return "Good";
        case(totalMark>44):
            return "Pass";
        default:
            return "Fail";
    }
}
