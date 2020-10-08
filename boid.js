class Boid {
    constructor() {
        this.position = createVector(random(width),random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2,4));
        this.acceleration = createVector();
        this.maxForce = 1;
        this.maxSpeed = 4;
        this.r = 3
        
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
        let perceptionRadius = AlignViewDistanceSlider.value();
        let steering = createVector();
        let total = 0;
        for (let point of points){
            let other = point.userData;
            let d = dist(this.position.x, this.position.y,other.position.x,other.position.y);
            if (d < perceptionRadius && other != this) {
                steering.add(other.velocity);
                total++;
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
    seperation(points) {
        let perceptionRadius = separationDistanceSlider.value();
        let steering = createVector();
        let total = 0;
        for (let point of points){
            let other = point.userData;
            let d = dist(this.position.x, this.position.y,other.position.x,other.position.y);
            if (d < perceptionRadius && other != this) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d)
                steering.add(diff);
                total++;
            }
        }
        //run walls or not
        if (AvoidWalls.checked()){
            let d = dist(this.position.x, this.position.y, width, this.position.y);
            let diff = p5.Vector.sub(this.position,createVector(width,this.position.y));
            diff.div(d * d)
            steering.add(diff);
            total++;
            d = dist(this.position.x, this.position.y, 0, this.position.y);
            diff = p5.Vector.sub(this.position,createVector(0,this.position.y));
            diff.div(d * d)
            steering.add(diff);
            total++;
            d = dist(this.position.x, this.position.y, this.position.x, height);
            diff = p5.Vector.sub(this.position,createVector(this.position.x,height));
            diff.div(d * d)
            steering.add(diff);
            total++;
            d = dist(this.position.x, this.position.y, this.position.x, 0);
            diff = p5.Vector.sub(this.position,createVector(this.position.x,0));
            diff.div(d * d)
            steering.add(diff);
            total++;
        }
        if (AvoidMouse.checked()){
            if (mouseIsPressed) {
                d = dist(this.position.x, this.position.y, mouseX, mouseY);
                diff = p5.Vector.sub(this.position,createVector(mouseX,mouseY));
                diff.div(d*(d/15))
                steering.add(diff);
                total++;
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
        let perceptionRadius = cohesionDistanceSlider.value();
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
        let alignment = this.align(points);
        let cohesion = this.cohesion(points);
        let seperation = this.seperation(points);
        if (FollowMouse.checked()){
            if (mouseIsPressed) {
                let mouse = this.FollowMouse();
                mouse.mult(.3)
                this.acceleration.add(mouse)
            }
        }

        seperation.mult(separationSlider.value());
        cohesion.mult(cohesionSlider.value());
        alignment.mult(alignSlider.value());

        this.acceleration.add(alignment)
        this.acceleration.add(cohesion)
        this.acceleration.add(seperation)

    }
    update() {
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
        this.acceleration.mult(0)
        this.maxSpeed = maxSpeedSlider.value();
        this.maxForce = maxForceSlider.value();
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