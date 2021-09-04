# GitHub action to edit JSON in a file.

## Usage
To update a field (may be nested) with a new value add this following step in your workflow. Creates a new file everytime and does not update the origin file.

    - name: Update JSON Data
      id: render-json-data (optional)
      uses: 898anil/github-actions-json-edit
      with:
        file_path: <path of the file having JSON data>
        field_path: <containerDefinitions.0.secrets.secret1> //
        field_value: <JSON compatible field value>

### Using multiple times.

    - name: Update JSON Data (2)
      id: render-json-data2
      uses: 898anil/github-actions-json-edit
      with:
        file_path: ${{steps.render-json-data.outputs.out_file}}
        field_path: <containerDefinitions.0.secrets.secret2> //
        field_value: <secret2 value>

## Why
While working on a GitHub action workflow to deploy an application to AWS ECS we came across an issue when we wanted to update 2 fields on a task definition one is the image another is a nested secret.

The task definition is a JSON file like looks some what like this 

    {
       "image": "docker_image:version",
       "containerDefinitions": [
           {
              "name": "container1",
              "secrets": {
                 "secret1": <SECRET_TO_BE_UPDATED>
              }
           }
           ....
       ]
       ....
    }
There is a  [GitHub action](https://github.com/aws-actions/amazon-ecs-render-task-definition) to render the task definition by updating the image field, but we could not find anything that can update the nested secret field, also we needed that after we update some fields the output should be written to a file and returns the new file path for our further steps. This is the reason of writing a new GitHub action.

