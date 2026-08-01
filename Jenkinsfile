pipeline{
    agent any

    tools{
        jdk 'JDK21'
        maven 'mvn3'
    }
    // environment {
    //     SCANNER_HOME = tool 'sonar-scanner'
    // }
    stages{
        stage('Git checkout'){
        steps{
            git branch : 'main', url: 'https://github.com/NakshatraGowda/foodrush'
        }
        }
        stage('mvn'){
        steps{
            sh '''
                mvn clean compile
            '''
        }
        }
        // stage {
        // steps('sonarqube analysis'){
        //     sh '''
        //     $SCANNER_HOME/bin/sonar-scanner -Dsonar.host.url=http://35.172.137.54:9000/ -Dsonar.login= \
        //     -Dsonar.projectName=foodrush \
        //     -Dsonar.projectKey=foodrush \
        //     -Dsonar.java.bonaries=. \
        //     '''
        // }
        // }
    }
}