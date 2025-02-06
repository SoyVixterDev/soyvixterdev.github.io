import { Scene } from "three";

/**
 * Class encapsulating from scene management to rendering
 */
export class SceneManager
{
    static scene = new Scene();
    static renderer = null;
    static mainCamera = null;

    constructor(renderer, mainCamera, color)
    {
        SceneManager.renderer = renderer;
        SceneManager.mainCamera = mainCamera;

        SceneManager.renderer.setPixelRatio(window.devicePixelRatio);
        SceneManager.renderer.setSize(window.innerWidth, window.innerHeight);
        SceneManager.renderer.setClearColor(color);

        window.addEventListener("resize", () => 
        {
            SceneManager.renderer.setSize(window.innerWidth, window.innerHeight);
        
            SceneManager.mainCamera.aspect = window.innerWidth / window.innerHeight;
            SceneManager.mainCamera.updateProjectionMatrix();
        });
    }


    /**
     * Called every animation frame to update the scene viewport
     */
    render()
    {
        if(SceneManager.mainCamera != null && SceneManager.renderer != null)
            SceneManager.renderer.render(SceneManager.scene, SceneManager.mainCamera);
    }
}