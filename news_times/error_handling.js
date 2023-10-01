let weight = 55
try{
    if(weight > 50) {
        console.log("중량 확인")
        throw new Error("적재 한도 초과")
    }
    console.log("하역 후 재확인 필요")

} catch(error) {
    
    console.log("내가 잡은 에러는", error.message)
}





