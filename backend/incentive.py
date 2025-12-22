amt={"Verna":2000,
     "Alcazar":5000
     }
def calculate(x):
    inc=0
    if x.total_quantity>=x.target:
        inc=x.total_quantity*1000
        
        for i in x.cars:
            if i.name=="Verna":
                inc=inc+(i.quantity*amt[i.name])
            elif i.name=="Alcazar":
                inc=inc+(i.quantity*amt[i.name])
            inc=inc+i.total_amount

    else:
        for i in x.cars:
            if i.name=="Verna":
                inc=inc+(i.quantity*(amt[i.name]//2))
            elif i.name=="Alcazar":
                inc=inc+(i.quantity*(amt[i.name]//2))
            inc=inc+(i.total_amount//2)
        
    return inc