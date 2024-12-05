using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "Data", menuName = "ScriptObject", order = 1)]
public class GameScript : ScriptableObject
{
    public string roleName ;
    public string description; 
    public bool enabled = false;
}
