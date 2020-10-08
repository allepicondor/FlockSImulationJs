const flock = [];
let ClearObstacles;
let alignSlider,AlignViewDistanceSlider, cohesionSlider,cohesionDistanceSlider, separationSlider,separationDistanceSlider,maxSpeedSlider,maxForceSlider;
let FollowMouse, AvoidMouse;
let obstacles = [];
let ObstacleMaking = false;
let startPos = [];
let r = 0
let indexOfMakingObstacle = -1

function setup(){
    createCanvas(900, 600)
    alignlabel = createDiv('Align Strength');
    alignlabel.position(10,height + 10);  
    alignSlider = createSlider(0,5,1,0.1);
    alignSlider.parent(alignlabel);

    AlignViewDistancelabel = createDiv('AlignViewDistance');
    AlignViewDistancelabel.position(10,height + 30);  
    AlignViewDistanceSlider = createSlider(0,1000,50,10);
    AlignViewDistanceSlider.parent(AlignViewDistancelabel);

    FlockCount = createInput(250);
    FlockCount.position(600,height - 3);

    cohesionlabel = createDiv('Cohesion Strength');
    cohesionlabel.position(10,height + 60);  
    cohesionSlider = createSlider(0,5,1,0.1);
    cohesionSlider.parent(cohesionlabel);

    cohesionDistancelabel = createDiv('cohesionViewDistance');
    cohesionDistancelabel.position(10,height + 80);  
    cohesionDistanceSlider = createSlider(0,1000,100,10);
    cohesionDistanceSlider.parent(cohesionDistancelabel);

    separationlabel = createDiv('Separation Strength');
    separationlabel.position(10,height + 110);  
    separationSlider = createSlider(0,5,1.2,0.05);
    separationSlider.parent(separationlabel);

    separationDistancelabel = createDiv('separationViewDistance');
    separationDistancelabel.position(10,height + 130);  
    separationDistanceSlider = createSlider(0,1000,50,10);
    separationDistanceSlider.parent(separationDistancelabel);

    maxSpeedlabel = createDiv('Max Speed');
    maxSpeedlabel.position(10,height + 160);  
    maxSpeedSlider = createSlider(0,20,4,1);
    maxSpeedSlider.parent(maxSpeedlabel);

    maxForcelabel = createDiv('Max Force');
    maxForcelabel.position(10,height + 180);  
    maxForceSlider = createSlider(0,3,1,0.1);
    maxForceSlider.parent(maxForcelabel);

    FollowMouse = createCheckbox('Follow Mouse', false);
    FollowMouse.position(10, height-3)
    AvoidMouse = createCheckbox('Avoid Mouse', false);
    AvoidMouse.position(150, height-3)
    AvoidWalls = createCheckbox('Avoid Walls', false);
    AvoidWalls.position(250, height-3)
    PlaceObstacle = createCheckbox('Place Obstacles', false);
    PlaceObstacle.position(350, height-3)

    ClearObstacles = createButton('ObstacleClear');
    ClearObstacles.position(500, height-3);
    ClearObstacles.mousePressed(function changeBG(){
        obstacles = []
    });

    for (let i = 0; i < FlockCount.value(); i++) {
        flock.push(new Boid());
    }
}
function draw(){
    if (flock.length < FlockCount.value()){
        for (let i = 0;i < FlockCount.value() - flock.length;i++){
            flock.push(new Boid());
        }
    }
    if (flock.length > FlockCount.value()){
        for (let i = 0;i < flock.length - FlockCount.value();i++){
            flock.pop()
        }
    }
    background(51)
    fill(255,0,0);
    stroke(0);
    for (let obstacle of obstacles){
        circle(obstacle[0],obstacle[1],obstacle[2])
    }
    if (PlaceObstacle.checked()){
        if (mouseIsPressed){
            if (!ObstacleMaking){
                ObstacleMaking = true
                startPos = [mouseX,mouseY]
                r = 0
                obstacles.push([startPos[0],startPos[1],r])
            }else{
                r = dist(startPos[0],startPos[1],mouseX,mouseY)
                print(obstacles[obstacles.length])
                obstacles[obstacles.length-1][2] = r
            }
        }else{
            if (ObstacleMaking){
                obstacles[obstacles.length-1][2][r]
                ObstacleMaking = false;
            }
        }
    }


    let boundary = new Rectangle(width/2,height/2,width,height)
    let qtree = new QuadTree(boundary, 4)
    for (let boid of flock){
        let point = new Point(boid.position.x,boid.position.y,boid);
        qtree.insert(point);
    }
    for (let boid of flock) {
        boid.edges();
        boid.flock(qtree)
        boid.update();
        boid.show();
    }
}
