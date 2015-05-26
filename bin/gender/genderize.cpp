#include <vector>
#include <iostream>
#include <fstream>
#include "json.cpp"
#include "stringmap.h"

using namespace std;

const int MALE = 0;
const int FEMALE = 1;
const int UNDETERMINED = 2;

bool loadLinearSVCJSONFromFile(const string& filename, Json::Value& svcJSON)
{
    ifstream file;
    file.open(filename, ios::binary | ios::in);
    if (!file.is_open())
        return false;

    std::stringstream buffer;
    buffer << file.rdbuf();
    file.close();
    Json::Reader reader;
    return reader.parse(buffer.str(), svcJSON);
}

void toLowerCase(string &str)
{
    const int length = str.length();
    for(int i = 0; i < length; i++)
        str[i] = tolower(str[i]);
}

class GenderClassifier
{
public:
    GenderClassifier(const string& filename)
    {
        ngramCoefficients = NULL;
        nameGenderMap = NULL;
        Json::Value svcJSON;
        if (loadLinearSVCJSONFromFile(filename, svcJSON)) {
            // Load the intercept and threshold.
            uncertaintyThreshold = svcJSON["uncertainty_threshold"].asDouble();
            intercept = svcJSON["intercept"].asDouble();
            // Load the SVM ngram coefficients.
            Json::Value coefficientsJSON = svcJSON["coefficients"];
            ngramCoefficients = new ConstantSizeStringMap<float>(coefficientsJSON.size(), 0.0);
            for(Json::ValueIterator iter = coefficientsJSON.begin() ; iter != coefficientsJSON.end() ; iter++) {
                string ngram = iter.key().asString();
                ngramCoefficients->insert(ngram, coefficientsJSON[ngram].asDouble());
            }
            // Load the male and female names.
            Json::Value maleNamesJSON = svcJSON["male_names"];
            Json::Value femaleNamesJSON = svcJSON["female_names"];
            nameGenderMap = new ConstantSizeStringMap<int>(maleNamesJSON.size() + femaleNamesJSON.size(), UNDETERMINED);
            for(int index = 0; index < maleNamesJSON.size(); index++)
                nameGenderMap->insert(maleNamesJSON[index].asString(), MALE);

            for(int index = 0; index < femaleNamesJSON.size(); index++)
                nameGenderMap->insert(femaleNamesJSON[index].asString(), FEMALE);
        }
    }

    ~GenderClassifier()
    {
        if (ngramCoefficients) delete ngramCoefficients;
        if (nameGenderMap) delete nameGenderMap;
    }

    int predict(string name)
    {
        toLowerCase(name);
        int prediction = nameGenderMap->get(name);
        if (prediction != UNDETERMINED)
            return prediction;

        float distance = signedDistance(name);
        if (distance > uncertaintyThreshold)
            return FEMALE;

        else if (distance < -uncertaintyThreshold)
            return MALE;

        return UNDETERMINED;
    }

    bool successfullyInitialized()
    {
        return ngramCoefficients && nameGenderMap;
    }

private:
    float signedDistance(const string& name) {
        float dotproduct = 0;
        int norm = 0;
        string nameWithStartAndEndChars = "^" + name + "$";
        size_t nameLength = nameWithStartAndEndChars.size();
        // For 2-, 3- and 4-grams...
        for (int n = 2; n < 5; n++) {
            // For each consecutive chunk of characters...
            for (int cursor = 0; cursor <= nameLength - n; cursor++) {
                string gram = nameWithStartAndEndChars.substr(cursor, n);
                float coefficient = ngramCoefficients->get(gram);
                if (coefficient != 0.0) {
                    dotproduct += coefficient;
                    norm++;
                }
            }
        }
        return norm != 0 ? dotproduct / norm + intercept : 0;
    }

    ConstantSizeStringMap<float>* ngramCoefficients;
    ConstantSizeStringMap<int>* nameGenderMap;
    float intercept;
    float uncertaintyThreshold;
};

int main(int argc, char* argv[])
{
    GenderClassifier genderClassifier("bin/gender/linsvc.json");
    if (!genderClassifier.successfullyInitialized()) {
        cout << "{\"error\": \"the server failed to parse linear SVC data.\"}";
        return 1;
    }
    ConstantSizeStringMap<bool> inputNames(argc, false);
    cout << "{";
    for (int i = 1; i < argc; i++) {
        string name = string(argv[i]);
        if (inputNames.get(name))
            continue;

        if (i != 1)
            cout << ",";

        cout << "\"" << name << "\"" << ":" << genderClassifier.predict(name);
        inputNames.insert(name, true);
    }
    cout << "}";
    cout.flush();
    return 0;
}
