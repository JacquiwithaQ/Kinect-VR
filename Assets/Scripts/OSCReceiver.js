
public var RemoteIP : String = "127.0.0.1"; //127.0.0.1 signifies a local host (if testing locally
public var SendToPort : int = 9000; //the port you will be sending from
public var ListenerPort : int = 7000; //the port you will be listening on
public var controller : Transform;
public var gameReceiver = "Cube"; //the tag of the object on stage that you want to manipulate
private var handler : Osc;

//VARIABLES YOU WANT TO BE ANIMATED
private var yRot : int = 0; //the rotation around the y axis
private var xRot : int = 0;
private var zRot : int = 0;

public function Start () 
{
	//Initializes on start up to listen for messages
	//make sure this game object has both UDPPackIO and OSC script attached

	var udp : UDPPacketIO = GetComponent('UDPPacketIO');
	udp.init(RemoteIP, SendToPort, ListenerPort);
	handler = GetComponent('Osc');
	handler.init(udp);
	handler.SetAllMessageHandler(AllMessageHandler);

}

Debug.Log("Running");

function Update () {
	for(var go : GameObject in GameObject.FindGameObjectsWithTag(gameReceiver))
	{
		go.transform.Rotate(xRot, yRot, zRot);
	}
}

//These functions are called when messages are received
//Access values via: oscMessage.Values[0], oscMessage.Values[1], etc

public function AllMessageHandler(oscMessage: OscMessage){


	var msgString = Osc.OscMessageToString(oscMessage); //the message and value combined
	var msgAddress = oscMessage.Address; //the message parameters
	var msgValue = oscMessage.Values[0]; //the message value
	Debug.Log(msgString); //log the message and values coming from OSC
	//Debug.Log(msgValue);

	//FUNCTIONS YOU WANT CALLED WHEN A SPECIFIC MESSAGE IS RECEIVED
	switch (msgAddress){
		case '/NI':
			var rotateZval = msgValue*10;
			RotateZ(rotateZval);
			break;

		case '/plumbus':
			var rotateXval = msgValue*10;
			RotateX(rotateXval);
			break;

		// case '/plumbus':
		// 	var rotateYval = msgValue*10;
		// 	RotateY(rotateYval);
		// 	break;	


	default:
			Rotate(msgValue/100);
			break;
	}

}


//FUNCTIONS CALLED BY MATCHING A SPECIFIC MESSAGE IN THE ALLMESSAGEHANDLER FUNCTION
public function Rotate(msgValue) : void //rotate the cube around its axis
{
	yRot = msgValue;
}

public function RotateX(msgValue) : void //rotate the cube around its axis
{
	xRot = msgValue;
}

public function RotateZ(msgValue) : void //rotate the cube around its axis
{
	zRot = msgValue;
}
	
