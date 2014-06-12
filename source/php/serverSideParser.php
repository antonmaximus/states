<?php
//get the parameters from URL
$input=$_GET["input"];
$callback=$_GET["callback"];
$field=$_GET["field"];
// $input = "dakota";
// $field = "State";

//Search json object
function searchJson($obj, $field, $value) {
    $arr = array();
    foreach($obj as $item) {
        foreach($item as $child) {
            if(isset($child->$field) &&
            (strpos(strtolower($child->$field), strtolower($value)) !== false)) {
                $arr[] = ($child);
            }
            
        }
        return $arr;
    }
    return null;
}


//send a "VALID" json file
$jsonStringSample = '{"entries":[{"id": "29","name":"John", "age":"36"},{"id": "30","name":"Jack", "age":"23"}]}';
$jsonObjSample = json_decode($jsonStringSample);  //conver string to object so it's iterable


//Open file as json object.  Check json file if it's valid first! http://jsonlint.com/
$jsonObj = json_decode(file_get_contents("us_states.json"));


$data = searchJson($jsonObj, $field, $input); // returns {"id": "29","name":"John", "age":"36"}
$post_data = json_encode(array('data' => $data));

echo $post_data; 

?>
