using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class Loading : MonoBehaviour
{
    public Text labelText;
    // Start is called before the first frame update
    void Start()
    {
        StartCoroutine(PreLoadScene());
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    IEnumerator PreLoadScene()
    {
        var str = Application.streamingAssetsPath + "/Play";
        var request = UnityWebRequestAssetBundle.GetAssetBundle(str);
        request.SendWebRequest();
        
        while (!request.isDone)
        {
            var f =request.downloadProgress*100;
            //print(f);
            var n=Mathf.RoundToInt(f);
            //print(n);
            labelText.text = n.ToString();
            yield return 0;
        }
        if(request.isDone)
        {
            SceneManager.LoadScene("main");
        }
        if (request.result != UnityWebRequest.Result.Success)
        {
            print(request.result);
        }
        else
        {
            print(request.result);
            var mainScene = DownloadHandlerAssetBundle.GetContent(request);

            //SceneManager.LoadScene("main");
            //mainScene.Unload(false);//Ð¶ÔØ×ÊÔ´
        }

    }
}
