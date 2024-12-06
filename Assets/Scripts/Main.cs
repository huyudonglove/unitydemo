using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

public class Main : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void Hello();
    // Start is called before the first frame update
    public AudioSource BgmAudioSource;
    public GameObject MusicOn;
    public GameObject MusicOff;
    public GameObject ChangeButton;
    public GameScript gameData;
    void Start()
    {
        DontDestroyOnLoad(this);
        //gameData.roleName = "8945";
        print(gameData.roleName);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    public void PlayAduio()
    {
        BgmAudioSource.Play();
        MusicOff.SetActive(false);
        MusicOn.SetActive(true);
    }
    public void StopAduio() { 
        BgmAudioSource.Pause();
        MusicOff.SetActive(true);
        MusicOn.SetActive(false);
    }
    public void ChangeScene()
    {
        SceneManager.LoadScene("play");
        SceneManager.sceneLoaded += HideButton;
        //+=c#·½·¨¸³Öµ
    }
    private void HideButton(Scene s,LoadSceneMode L)
    {
        //BgmAudioSource.Play();
        ChangeButton.SetActive(false);
    }
    public void TestMsg()
    {
        Hello();
    }
    public void getMsg()
    {

    }
}
