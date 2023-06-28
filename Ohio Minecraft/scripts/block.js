function CreateBlock(BlockType, Position){
	let block = BlockLib[BlockType].createInstance()
	block.Name = BlockType
	block.Solid = BlockLib[BlockType].Solid
	block.Liquid = BlockLib[BlockType].Liquid
	block.LinkedMeshes = BlockLib[BlockType].LinkedMeshes

	block.position.x = Position.x 
	block.position.y = Position.y 
	block.position.z = Position.z 

	block.collisionsEnabled = block.Solid
	block.checkCollisions = block.Solid
	block.isPickable = !block.Liquid

	block.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD 
	block.freezeWorldMatrix()

	for (var mesh of block.LinkedMeshes){
		let sprite = mesh.createInstance()
		sprite.Name = BlockType.replace("Block", "")
		sprite.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
		sprite.position.x = Position.x
		sprite.position.y = Position.y
		sprite.position.z = Position.z
		sprite.isPickable = false
		if (block.LinkedMeshes.indexOf(mesh)==1) sprite.rotation.y = BABYLON.Tools.ToRadians(90)
	}

}


function PointBlock(){
	return Scene.pick(document.documentElement.clientWidth/2, document.documentElement.clientHeight/2).pickedMesh
}


function BreakBlock(){
	let block = PointBlock()

	if (!block) return

	for (var mesh of Scene.meshes.filter(i=>
		i.Name==block.Name.replace("Block", "") &&
		i.position.x==block.position.x &&
		i.position.y==block.position.y &&
		i.position.z==block.position.z
	)) Scene.removeMesh(mesh)

	Scene.removeMesh(block)
}


function PlaceBlock(){
	if (!PointBlock()) return

	let slot = Hotbar.filter(i=>i.Picked)[0]
	if (!slot.Name) return

	CreateBlock(slot.Name, {
		x: PointBlock().position.x,
		y: PointBlock().position.y+Settings.BlockWidth,
		z: PointBlock().position.z,
	})
}