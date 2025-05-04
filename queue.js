class Queue {

    constructor(max) {
        this.array = new Array(max);
        
        this.length = 0;
        this.front = 0;
        
    }

    insert(item) {
        if (this.length<this.array.length) {
            this.array[this.length]=item;
            this.length+=1;
        }
        else {
            this.array[this.front]=item;
            this.front+=1;
            
            this.front%(this.length);
            
        }
    }
    to_string(item) {

        string = "";
        for (i=0;i<this.length;i++) {
            index = (this.front+i)%this.length;
            string+=this.array[index];
        }
        return string;
    }
}