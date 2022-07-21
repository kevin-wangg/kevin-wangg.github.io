class World {
    constructor() {
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        this.container;
        this.stats;
        this.camera;
        this.scene;
        this.renderer;
        this.debug = true;
        this.debugPhysics = true;
        this.fixedTimeStep = 1.0 / 60.0;

        this.container = document.createElement('div');
        this.container.style.height = '100%';
        document.body.appendChild(this.container);

        const game = this;

        this.forward = 0;
        this.turn = 0;

        this.clock = new THREE.Clock();

        this.init();

        window.onError = function (error) {
            console.error(JSON.stringify(error));
        }

    }

    init() {
        const game = this;
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa0a0a0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        this.helper = new CannonHelper(this.scene);
        this.helper.addLights(this.renderer);

        window.addEventListener('resize', function () { game.onWindowResize(); }, false);
        window.addEventListener('keydown', function (e) { game.onKeyDown(e) }, false);
        window.addEventListener('keyup', function (e) { game.onKeyUp(e) }, false);

        // stats
        if (this.debug) {
            this.stats = new Stats();
            this.container.appendChild(this.stats.dom);
        }

        this.initPhysics()
    }

    initPhysics() {
        this.physics = {};

        const game = this;
        const world = new CANNON.World();
        this.world = world;

        world.broadphase = new CANNON.SAPBroadphase(world);
        world.gravity.set(0, -10, 0);
        world.defaultContactMaterial.friction = 0;

        const groundMaterial = new CANNON.Material("groundMaterial");
        const wheelMaterial = new CANNON.Material("wheelMaterial");
        const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
            friction: 0.3,
            restitution: 0,
            contactEquationStiffness: 1000
        })
        world.addContactMaterial(wheelGroundContactMaterial);

        const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
        const chassisBody = new CANNON.Body({ mass: 150, material: groundMaterial })
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 10, 0);
        this.helper.addVisual(chassisBody, 'car');

        this.helper.shadowTarget = chassisBody.threemesh

        const options = {
            radius: 0.5,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 30,
            suspensionRestLength: 0.5,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 1,
            useCustomSlidingRotationalSpeed: false
        };

        const vehicle = new CANNON.RaycastVehicle({
            chassisBody: chassisBody,
            indexRightAxis: 0,
            indexUpAxis: 1,
            indeForwardAxis: 2
        });

        options.chassisConnectionPointLocal.set(1, 0, -1);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, 0, -1);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(1, 0, 1);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, 0, 1);
        vehicle.addWheel(options);

        vehicle.addToWorld(world);

        const wheelBodies = [];
        vehicle.wheelInfos.forEach(function (wheel) {
            const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
            const wheelBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
            const q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
            wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
            wheelBodies.push(wheelBody);
            game.helper.addVisual(wheelBody, 'wheel');
        });

        // Update wheels
        world.addEventListener('postStep', function () {
            let index = 0;
            game.vehicle.wheelInfos.forEach(function (wheel) {
                game.vehicle.updateWheelTransform(index);
                const t = wheel.worldTransform;
                wheelBodies[index].threemesh.position.copy(t.position);
                wheelBodies[index].threemesh.quaternion.copy(t.quaternion);
                index++;
            });
        });

        this.vehicle = vehicle

        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial })
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.addShape(groundShape);
        world.add(groundBody);
        this.helper.addVisual(groundBody, 'floor');

        this.groundMaterial = groundMaterial;

        this.drawBlock(1, 2, 2, -20, 2, -10);
        this.drawLetter('KEVIN', -10, -10);
        this.drawLetter('W', 10, -10);
        this.drawLetter('A', 15.5, -10);
        this.drawLetter('N', 20, -10);
        this.drawLetter('G', 24, -10)

        this.drawInstructions();

        this.animate();
    }

    drawString(letters, pos) {

    }

    drawInstructions() {
        this.drawLetter('Use WASD to move', -30, 10, true, 2, 0xffffff, 0.1, 0);
        this.drawLetter('Currently under construction', -30, 15, true, 1.5, 0xfcdb03, 0.1, 0);
    }
    
    drawLetter(letter, x, z, faceUp = false, fontSize = 4, color = 0x97df5e, height=0.7, mass=2) {
        const loader = new THREE.FontLoader();
        loader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            const geometry = new THREE.TextGeometry(letter, {
                font: font,
                size: fontSize,
                height: height,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 5
            })
            if(faceUp) geometry.rotateX(-Math.PI / 2)
            const material = new THREE.MeshPhongMaterial({ color: color });
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();

            const size = geometry.boundingBox.getSize(new THREE.Vector3());
            const { center } = geometry.boundingSphere;
            console.log(size);
            const box = new CANNON.Box(new CANNON.Vec3().copy(size).scale(0.5));
            const boxBody = new CANNON.Body({ mass: mass, material: material })
            boxBody.addShape(box, new CANNON.Vec3(center.x, center.y, center.z));
            boxBody.position.set(x, 0, z);
            this.helper.addVisual(boxBody, 'block', geometry, material);

            const material_ground = new CANNON.ContactMaterial(this.groundMaterial, material, {
                friction: 1.0,
                restitution: 0.1
            })

            this.world.add(boxBody);
            this.world.addContactMaterial(material_ground);

        })
    }

    drawBlock(xlen, ylen, zlen, xpos, ypos, zpos) {
        const material = new CANNON.Material();
        const boxShape = new CANNON.Box(new CANNON.Vec3(xlen, ylen, zlen));
        const boxBody = new CANNON.Body({ mass: 2, material: material })
        boxBody.addShape(boxShape);
        boxBody.position.set(xpos, ypos, zpos);
        this.helper.addVisual(boxBody, 'block');

        const material_ground = new CANNON.ContactMaterial(this.groundMaterial, material, {
            friction: 1.0,
            restitution: 0.1
        })

        this.world.add(boxBody);
        this.world.addContactMaterial(material_ground);
    }

    onKeyUp(e) {
        // FIX THIS
        if (e.key == 'w' || e.key === 's') {
            this.forward = 0;
        }
        else {
            this.turn = 0;
        }

    }
    onKeyDown(e) {
        console.log(e.key);
        if (e.key === 'w') {
            this.forward = 0.5;
        }
        else if (e.key == 's') {
            this.forward = -0.5;
        }
        else if (e.key == 'a') {
            this.turn = 0.5;
        }
        else if (e.key == 'd') {
            this.turn = -0.5;
        }
        else if(e.key == 'j') {
            this.vehicle.chassisBody.velocity.y = 10;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    updateDrive(forward = this.forward, turn = this.turn) {
        const maxSteerVal = 1.5;
        const maxForce = 1000;
        const brakeForce = 6.5;

        const force = maxForce * forward;
        const steer = maxSteerVal * turn;

        if (forward != 0) {
            this.vehicle.setBrake(0, 0);
            this.vehicle.setBrake(0, 1);
            this.vehicle.setBrake(0, 2);
            this.vehicle.setBrake(0, 3);

            this.vehicle.applyEngineForce(force, 2);
            this.vehicle.applyEngineForce(force, 3);
        }
        else {
            this.vehicle.setBrake(brakeForce, 0);
            this.vehicle.setBrake(brakeForce, 1);
            this.vehicle.setBrake(brakeForce, 2);
            this.vehicle.setBrake(brakeForce, 3);
        }

        this.vehicle.setSteeringValue(steer, 0);
        this.vehicle.setSteeringValue(steer, 1)
    }

    updateCamera() {
        let { x, y, z } = this.vehicle.chassisBody.threemesh.position
        this.camera.position.set(x + 10, y + 40, z + 30)
        this.camera.lookAt(this.vehicle.chassisBody.threemesh.position);
        if (this.helper.sun != undefined) {
            this.helper.sun.position.copy(this.camera.position);
            this.helper.sun.position.y += 10;
            this.helper.sun.position.x -= 20;
        }
    }

    animate() {
        const game = this;

        requestAnimationFrame(function () { game.animate(); });

        const now = Date.now();
        if (this.lastTime === undefined) this.lastTime = now;
        const dt = (Date.now() - this.lastTime) / 1000.0;
        this.FPSFactor = dt;
        this.lastTime = now;

        this.world.step(this.fixedTimeStep, dt);
        this.helper.updateBodies(this.world);

        this.updateDrive();
        this.updateCamera();

        this.renderer.render(this.scene, this.camera);

        if (this.stats != undefined) this.stats.update()
    }
}

