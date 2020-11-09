


class Boid {
    constructor() {
        this.position = createVector(random(width),random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2,4));
        this.acceleration = createVector();
        this.maxForce = 1;
        this.maxSpeed = 4;
        this.r = 4
        
    }

    edges() {
        if (this.position.x > width){
            this.position.x = 0;
        } else if (this.position.x < 0){
            this.position.x = width;
        }
        if (this.position.y > height){
            this.position.y = 0;
        } else if (this.position.y < 0){
            this.position.y = height;
        }
    }
    align(points) {
        let perceptionRadiusAlign = 50;
        let perceptionRadiusCohesion = 100;
        let steering = createVector();
        let total = 0;
        let steeringPos = createVector();
        let totalPos = 0;
        for (let point of points){
            let other = point.userData;
            let d = dist(this.position.x, this.position.y,other.position.x,other.position.y);
            if (d < perceptionRadiusAlign && other != this) {
                steering.add(other.velocity);
                total++;
            }
            if (d < perceptionRadiusCohesion && other != this){
                steeringPos.add(other.position);
                totalPos++;
            }
        }
        if (total > 0){
            steering.div(total);
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
            steering.mult(1);
        }
        if (totalPos > 0){
            steeringPos.div(totalPos);
            steeringPos.sub(this.position)
            steeringPos.setMag(this.maxSpeed)
            steeringPos.sub(this.velocity)
            steeringPos.limit(this.maxForce)
            steeringPos.mult(1);
        }
        return steering.add(steeringPos)
    }
    seperation(points) {
        let perceptionRadius = 50
        let steering = createVector();
        let total = 0;
        let diff  = p5.Vector;
        let d = 0
        for (let point of points){
            let other = point.userData;
            d = dist(this.position.x, this.position.y,other.position.x,other.position.y);
            if (d < perceptionRadius && other != this) {
                diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d)
                steering.add(diff);
                total++;
            }
        }
        if (obstacles.length > 0){
            for (let obstacle of obstacles){
                
                let d = dist(this.position.x, this.position.y, obstacle[0], obstacle[1]);
                if (d<perceptionRadius+obstacle[2]+50){
                    let diff = p5.Vector.sub(this.position,createVector(obstacle[0], obstacle[1]));
                    diff.div(d*(d/30))
                    steering.add(diff);
                    total++;
                }
            }
        }
        
        
        if (total > 0){
            steering.div(total);
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }
    cohesion(points) {
        let perceptionRadius = 100;
        let steering = createVector();
        let total = 0;
        for (let point of points){
            let other = point.userData;
            let d = dist(this.position.x, this.position.y,other.position.x,other.position.y);
            if (d < perceptionRadius && other != this) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0){
            steering.div(total);
            steering.sub(this.position)
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering;
    }
    FollowMouse(){
        let steering = createVector();
        steering.add(createVector(mouseX,mouseY))
        steering.sub(this.position)
        steering.setMag(this.maxSpeed)
        steering.sub(this.velocity)
        steering.limit(this.maxForce)
        return steering;
    }
    flock(qtree) {
        let range = new Circle(this.position.x,this.position.y,100)
        let points = qtree.query(range)
        let alignment_cohesion = this.align(points);
        let seperation = this.seperation(points);

        seperation.mult(1.2);

        this.acceleration.add(alignment_cohesion)
        this.acceleration.add(seperation)

    }
    update() {
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
        this.acceleration.mult(0)
        this.maxSpeed = 4;
        this.maxForce = 1;
    }
    show() {
        let theta = this.velocity.heading() + radians(90);
        fill(127);
        stroke(200);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }

}