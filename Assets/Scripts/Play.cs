using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Play : MonoBehaviour
{
    // Start is called before the first frame update
    public GameObject bg1;
    public GameObject bg2;
    private GameObject bgm;
    private Vector2 touchStartPos;
    private Vector2 touchEndPos;
    private float lastSrollTime = 0f;
    public  GameScript gameData;
    void Start()
    {
        bgm = GameObject.Find("bgm");
        //bgm.GetComponent<AudioSource>().Stop();
        print(bgm);
        //var ss = GameObject.Find("AllCanvas");
        //print(ss);
        //var d =ss.GetComponent<Main>();
        //print(d.gameData);
        //gameData = d.gameData;
        //print(gameData.roleName);
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            print(touch);
            if (touch.phase == TouchPhase.Moved)
            {
                touchEndPos = touch.deltaPosition;
                //向上小于0，向下大于0
                print(touchEndPos);
                JudgeUpDown();
            }
        }
        float scroll = Input.mouseScrollDelta.y;
        //print(scroll);
        if (scroll > 0)
        {
            print("向上");
            JudgeUpDown();
        }
        if (scroll < 0)
        {
            print("向下");
            JudgeUpDown();
        }
    }
    public void ChangeShow()
    {
        bg1.SetActive(true);
        bg2.SetActive(false);
    }
    private void JudgeUpDown()
    {
        if (Time.time - lastSrollTime > 4)
        {
            print("时间大于4S");
            lastSrollTime = Time.time;
            var sceneName = SceneManager.GetActiveScene().name;
            if (sceneName == "Play")
            {
                print("shide");
            }
            return;
        }
        else
        {
            print("时间小于4S");
        }


    }
}
