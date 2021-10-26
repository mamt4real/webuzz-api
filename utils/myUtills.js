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

exports.getDuration = (dateCreated) => {
    const timeDiff = Date.now() - dateCreated;
    const dateVars = {
        Year: parseInt(timeDiff/(1000 * 60 * 60 * 24 * 365)),
        Month: parseInt(timeDiff/(1000* 60 * 60 * 24 * 30)),
        Week: parseInt(timeDiff/(1000* 60 * 60 * 24 * 7)),
        Day: parseInt(timeDiff/(1000* 60 * 60 * 24)),
        Hour: parseInt(timeDiff/(1000* 60 * 60)),
        Minute: parseInt(timeDiff/(1000* 60)),
        Seconds: parseInt(timeDiff/1000)
    }

    for(const timeParam in dateVars){
        const no = dateVars[timeParam];
        if(no >= 1){
            return `${no} ${timeParam}${no>1?'s':''} ago`;
        }
    }
    return '0 seconds ago';
}
